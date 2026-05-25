import { AutoModeOptions } from 'sillytavern-utils-lib/types/translate';

export enum PromptEngineeringMode {
  NATIVE = 'native',
  JSON = 'json',
  XML = 'xml',
}

export interface Schema {
  name: string;
  value: object;
  html: string;
}

export interface ExtensionSettings {
  version: string;
  formatVersion: string;
  profileId: string;
  maxResponseToken: number;
  autoMode: AutoModeOptions;
  schemaPreset: string;
  schemaPresets: Record<string, Schema>;
  prompt: string;
  includeLastXMessages: number; // 0 means all messages
  includeLastXCoachFeedbackMessages: number; // 0 means none
  promptEngineeringMode: PromptEngineeringMode;
  promptJson: string;
  promptXml: string;
}

export const extensionName = 'st-english-coach';

const DEFAULT_FEEDBACK_RULES = `Feedback rules:
1. Review only the user's latest roleplay writing. Use the character's latest response only for context and vocabulary.
2. Return at most 2 writingFeedback items. Pick high-value issues only: errors that block meaning, common learner mistakes, or clearly unnatural phrasing.
3. Use the smallest exact original span that shows the issue. Prefer a word, phrase, or one short sentence.
4. Never use the whole user message as original unless it is 12 words or fewer and cannot be corrected as smaller spans.
5. Do not add a broad style rewrite when grammar or wording items already fix the same text.
6. Merge related fixes into one item when they are in the same short span. Do not create duplicate feedback for markup, quotes, casing, punctuation, tense, or wording around the same words.
7. Explain in simple Indonesian, one short sentence per item.
8. In roleplay, quoted text is usually dialogue. Text inside *asterisks* is usually action, narration, or emphasis. Do not criticize the markup itself unless it makes the writing unclear.
9. Vocabulary or phrases must come from the character response, not the user's message. Return at most 3 vocabulary items.
10. feedbackSummary must be one short Indonesian sentence and must not repeat the same corrections from writingFeedback.`;

export const DEFAULT_PROMPT = `You are an RP English Coach. Give selective, practical feedback for English learning without interrupting the roleplay.

${DEFAULT_FEEDBACK_RULES}

Return complete data for every schema field. If there are no useful items for an array, return an empty array.`;

export const DEFAULT_PROMPT_JSON = `You are an RP English Coach. Generate one valid JSON object that strictly follows the provided JSON schema.

${DEFAULT_FEEDBACK_RULES}

Output rules:
1. You MUST wrap the entire JSON object in a markdown code block (\`\`\`json\n...\n\`\`\`).
2. Your response MUST NOT contain explanatory text, comments, or any other content outside this single code block.
3. The JSON object inside the code block MUST be valid and conform to the schema.
4. Return complete data for every schema field. If there are no useful items for an array, return an empty array.

JSON schema to follow:
\`\`\`json
{{schema}}
\`\`\`

Example perfect response:
\`\`\`json
{{example_response}}
\`\`\`
`;

export const DEFAULT_PROMPT_XML = `You are an RP English Coach. Generate one valid XML structure that follows the provided schema and example.

${DEFAULT_FEEDBACK_RULES}

Output rules:
1. You MUST wrap the entire XML object in a markdown code block (\`\`\`xml\n...\n\`\`\`).
2. Your response MUST NOT contain explanatory text, comments, or any other content outside this single code block.
3. The XML object inside the code block MUST be valid.
4. Return complete data for every schema field. If there are no useful items for an array, return an empty array.

JSON schema to follow:
\`\`\`json
{{schema}}
\`\`\`

Example perfect response:
\`\`\`xml
<root>
{{example_response}}
</root>
\`\`\`
`;

export const DEFAULT_SCHEMA_VALUE: object = {
  $schema: 'http://json-schema.org/draft-07/schema#',
  title: 'RPEnglishCoachFeedback',
  description: 'Schema for roleplay English coaching feedback',
  type: 'object',
  properties: {
    feedbackSummary: {
      type: 'string',
      description: 'One short Indonesian sentence summarizing the main learning point. Do not repeat item details.',
    },
    writingFeedback: {
      type: 'array',
      description:
        'At most 2 selective, non-duplicate feedback items. Use small spans only. Do not add a whole-message style rewrite when smaller grammar or wording fixes already cover the issue.',
      items: {
        type: 'object',
        properties: {
          original: {
            type: 'string',
            description:
              'Smallest exact word, phrase, or short sentence from the user message that needs attention. Avoid whole-message originals unless the message is 12 words or fewer.',
          },
          suggestion: {
            type: 'string',
            description: 'More natural or correct English version of only the original span.',
          },
          category: {
            type: 'string',
            description: 'Issue type, such as grammar, wording, clarity, style, or unnecessary_detail.',
          },
          explanation: {
            type: 'string',
            description: 'Short Indonesian explanation of why the suggestion is better.',
          },
        },
        required: ['original', 'suggestion', 'category', 'explanation'],
      },
    },
    vocabulary: {
      type: 'array',
      description: 'At most 3 useful or difficult words and phrases from the character response only.',
      items: {
        type: 'object',
        properties: {
          term: {
            type: 'string',
            description: 'Word or phrase from the character response.',
          },
          meaning: {
            type: 'string',
            description: 'Indonesian meaning.',
          },
          note: {
            type: 'string',
            description: 'Short usage note in Indonesian.',
          },
          example: {
            type: 'string',
            description: 'Simple example sentence using the term.',
          },
        },
        required: ['term', 'meaning', 'note', 'example'],
      },
    },
  },
  required: ['feedbackSummary', 'writingFeedback', 'vocabulary'],
};

export const DEFAULT_SCHEMA_HTML = `<div class="rp_english_coach_template">
    <details>
        <summary><span>RP English Coach</span></summary>
        <p class="rp_english_coach_summary">{{data.feedbackSummary}}</p>

        <div class="rp_english_coach_section">
            <strong>Writing feedback</strong>
            {{#each data.writingFeedback as |item|}}
            <div class="rp_english_coach_card">
                <div><b>Original:</b> {{item.original}}</div>
                <div><b>Better:</b> {{item.suggestion}}</div>
                <div><b>Category:</b> {{item.category}}</div>
                <div><b>Why:</b> {{item.explanation}}</div>
            </div>
            {{/each}}
        </div>

        <div class="rp_english_coach_section">
            <strong>Vocabulary / phrases</strong>
            {{#each data.vocabulary as |item|}}
            <div class="rp_english_coach_card">
                <div><b>{{item.term}}</b> — {{item.meaning}}</div>
                <div>{{item.note}}</div>
                <div><i>{{item.example}}</i></div>
            </div>
            {{/each}}
        </div>
    </details>
</div>`;

const VERSION = '0.2.0';
const FORMAT_VERSION = 'F_2.0';
export const EXTENSION_KEY = 'RPEnglishCoach';

export const defaultSettings: ExtensionSettings = {
  version: VERSION,
  formatVersion: FORMAT_VERSION,
  profileId: '',
  maxResponseToken: 16000,
  autoMode: AutoModeOptions.RESPONSES,
  schemaPreset: 'default',
  schemaPresets: {
    default: {
      name: 'Default',
      value: DEFAULT_SCHEMA_VALUE,
      html: DEFAULT_SCHEMA_HTML,
    },
  },
  prompt: DEFAULT_PROMPT,
  includeLastXMessages: 0,
  includeLastXCoachFeedbackMessages: 1,
  promptEngineeringMode: PromptEngineeringMode.NATIVE,
  promptJson: DEFAULT_PROMPT_JSON,
  promptXml: DEFAULT_PROMPT_XML,
};
