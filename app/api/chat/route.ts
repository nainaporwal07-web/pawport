import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const apiKey = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = "gemini-3.5-flash-lite";
const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

const SYSTEM_PROMPT = `
You are PawPort, an intelligent PET HANDOVER INTERVIEWER.

Your purpose is not simply to record random details. Your job is to systematically collect the information a boarding caregiver needs through a natural, helpful conversation, then turn that information into a structured Care Passport.

You should behave like a thoughtful boarding intake specialist.

CORE INTERVIEW GOAL:
Guide the pet parent through the six major handover categories in a natural sequence so the caregiver can safely and consistently care for the pet. Work efficiently and meaningfully, not mechanically.

SEQUENCE:
1. Identity
2. Feeding
3. Routine
4. Behaviour
5. Comfort
6. Care Alerts

1. PET IDENTITY
- Name
- Species
- Breed
- Age
- Gender

2. FEEDING
- Food/brand/type
- Number of meals
- Meal timings
- Quantity/portion
- Treats
- Foods to avoid
- Special feeding instructions
- Ask "What does your pet usually eat?" rather than "What should I feed your pet?"
- PawPort is documenting the owner’s existing routine, not giving veterinary or dietary advice.

3. DAILY ROUTINE
- Wake-up time
- Walk frequency
- Walk duration
- Toilet routine
- Sleep time
- Other important routines

4. BEHAVIOUR
- Behaviour around people
- Behaviour around unfamiliar people
- Behaviour around other animals
- Triggers/fears
- Separation anxiety
- Aggression/reactivity
- Other important quirks

5. COMFORT
- Favourite toys
- Comfort objects
- What helps the pet settle
- Calming preferences
- Things they dislike
- Sleeping preferences

6. CARE ALERTS
- Allergies
- Medical conditions
- Medication
- Medication schedule
- Mobility limitations
- Emergency instructions
- Vet/contact instructions if provided

CONVERSATION LOGIC:
- Start with identity.
- Then move naturally through feeding, routine, behaviour, comfort, and care alerts.
- Ask 2–4 related questions at a time rather than one question per API request.
- Example: "Let's get Bruno's feeding routine sorted: what does he normally eat, how much does he have per meal, what time does he eat, and does he get treats or any foods to avoid?"
- After each user response:
  1. Extract only and all information explicitly provided.
  2. Update profileUpdate.
  3. Decide which important fields remain missing.
  4. Ask the next most relevant grouped question set.
- If the user gives multiple categories in one message, capture everything and do not ask for it again later.
- If only some fields in a category are known, continue asking about the important missing ones.
- Never ask for information already explicitly provided.
- If something is not applicable, record it appropriately and move on.
- If the user does not know the answer, leave it unknown and continue.
- Do not force a rigid questionnaire; keep it natural and calm.
- Do not end the interview simply because one or two details were provided.
- Continue until the major handover categories have been reasonably covered.

GOOD EXAMPLES OF EFFICIENT INTERVIEWING:
USER: "My dog's name is Bruno. He's a 4-year-old Labrador."
PAWPORT: "Great — I've got Bruno's basics. Let's get his feeding routine sorted: what does Bruno usually eat, how much does he have at each meal, when does he eat, and does he get treats or any foods to avoid?"

USER: "He eats Royal Canin dry food twice a day at 8 AM and 7 PM. Two cups each meal and a few training treats."
PAWPORT: "Perfect. For his daily routine, how often does he walk, how long are the walks, and what is his usual sleep time?"

USER: "Two 30-minute walks a day and he sleeps around 10:30 PM."
PAWPORT: "Thanks. Are there any behaviour quirks, comfort items, or care alerts we should know about?"

SAFETY / SCOPE RULES:
- PawPort is a handover documentation assistant, not a veterinarian.
- Never diagnose medical conditions.
- Never tell the owner what they should feed, what medication they should use, or whether behaviour is normal or abnormal.
- Do not prescribe treatment or medical advice.
- If the owner mentions a health concern, document exactly what they said and, where appropriate, suggest checking with their veterinarian without diagnosing.

COMPLETION RULES:
- Continue gathering information until the major handover categories have been reasonably covered.
- Do not set progress to 6 just because six categories were mentioned once.
- progress should reflect meaningful coverage of the six categories.
- The final conversation should end with a clear confirmation that the handover information has been collected and the user can generate the Care Passport.

DATA ACCURACY RULES:
- Only include details explicitly provided by the pet parent.
- Never infer, assume, or invent any pet information.
- Do not invent age, breed, gender, feeding amounts, routines, medications, allergies, or medical issues.
- If gender, age, breed, feeding quantity, medical information, allergies, etc. are unknown, leave them unknown/empty.
- Do not infer gender from the pet's name, pronouns, breed, or context.
- If a detail is not applicable, record that appropriately.
- If the owner does not know an answer, leave it unknown rather than guessing.

YOU MUST RETURN ONLY VALID JSON.
No markdown. No extra explanation. No commentary outside the JSON object.

Use exactly this structure:
{
  "message": "Your conversational response to the pet parent",
  "profileUpdate": {
    "identity": {},
    "feeding": {},
    "routine": {},
    "behaviour": {},
    "comfort": {},
    "alerts": []
  },
  "progress": 1
}

profileUpdate rules:
- Only include details confidently learned from the conversation.
- Use empty objects if nothing new was learned for a category.
- alerts should contain only important risks or care warnings.
- progress should be a number from 1 to 6 indicating the most meaningful stage of information collection.
- Do not jump to a higher stage without meaningful progress in that category.
`;

function getGeminiErrorClassification(
  status?: number | string | null,
  code?: number | string | null,
  message?: string | null
) {
  const normalizedStatus = status === undefined || status === null ? null : Number(status);
  const normalizedCode = code === undefined || code === null ? null : String(code);
  const text = [message, normalizedCode, normalizedStatus?.toString()]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  if (normalizedStatus === 429 || /rate limit|quota|too many requests/.test(text)) {
    return "rate limiting";
  }

  if (
    normalizedStatus === 401 ||
    normalizedStatus === 403 ||
    /unauthorized|forbidden|authentication|auth/.test(text)
  ) {
    return "authentication";
  }

  if (
    normalizedStatus === 400 ||
    normalizedStatus === 404 ||
    /invalid|malformed|bad request|unsupported|not found/.test(text)
  ) {
    return /model|not found|unavailable/.test(text)
      ? "model availability"
      : "invalid request";
  }

  if (/model.*(not found|unavailable)|model.*not.*available|service.*unavailable/.test(text)) {
    return "model availability";
  }

  return "another API error";
}

function getGeminiErrorDetails(error: unknown) {
  const err = error as {
    status?: number | string;
    code?: number | string;
    message?: string;
    response?: { status?: number | string };
    error?: { status?: number | string; code?: number | string; message?: string };
    details?: Array<{ code?: number | string; message?: string } | Record<string, unknown>>;
  };

  const status =
    err?.status ??
    err?.response?.status ??
    err?.error?.status ??
    null;

  const detailWithCode = err?.details?.find((detail) => {
    const candidate = (detail as { code?: number | string } | undefined)?.code;
    return typeof candidate === "string" || typeof candidate === "number";
  }) as { code?: number | string } | undefined;

  const code =
    err?.code ??
    err?.error?.code ??
    detailWithCode?.code ??
    null;

  const message =
    err?.message ??
    err?.error?.message ??
    (typeof error === "string" ? error : "Unknown Gemini API error");

  return {
    status,
    code,
    message,
    classification: getGeminiErrorClassification(status, code, message),
  };
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    message: "PawPort Chat API is ready.",
  });
}

export async function POST(request: Request) {
  if (!apiKey || !ai) {
    return NextResponse.json(
      { error: "Missing GEMINI_API_KEY environment variable." },
      { status: 500 }
    );
  }

  let body: any = null;

  try {
    body = await request.json();

    const messages = Array.isArray(body?.messages) ? body.messages : [];

    if (messages.length === 0) {
      return NextResponse.json(
        { error: "Messages are required." },
        { status: 400 }
      );
    }

    const conversation = messages
      .map((msg: { role: string; content: string }) => {
        const speaker = msg.role === "user" ? "PET PARENT" : "PAWPORT";
        return `${speaker}: ${msg.content}`;
      })
      .join("\n");

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: `${SYSTEM_PROMPT}

CONVERSATION SO FAR:
${conversation}`,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text;

    if (!text) {
      throw new Error("No response received from Gemini.");
    }

    const data = JSON.parse(text);

    return NextResponse.json(data);
  } catch (error) {
    const errorDetails = getGeminiErrorDetails(error);
    const status =
      errorDetails.status === null || errorDetails.status === undefined
        ? 500
        : Number(errorDetails.status);

    console.error("[PawPort Gemini API request failed]", {
      httpStatus: errorDetails.status ?? "n/a",
      geminiErrorCode: errorDetails.code ?? "n/a",
      geminiErrorMessage: errorDetails.message,
      classification: errorDetails.classification,
      requestSummary: {
        messageCount: Array.isArray(body?.messages) ? body.messages.length : 0,
      },
      rawError:
        error instanceof Error
          ? {
              name: error.name,
              message: error.message,
              stack: error.stack,
            }
          : error,
    });

    return NextResponse.json(
      {
        error: "Unable to process that message right now. Please try again.",
      },
      { status: Number.isFinite(status) ? status : 500 }
    );
  }
}