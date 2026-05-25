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

export const DEFAULT_PROMPT = `You are an RP English Coach. Review only the user's latest roleplay writing, using the character's latest response as context. Give selective, practical feedback for English learning without interrupting the roleplay.

Feedback rules:
1. Pick only the most useful writing issues: grammar, wording, clarity, natural phrasing, creative writing flow, or unnecessary detail.
2. Do not rewrite long messages. Correct short phrases or sentences only.
3. Explain in simple Indonesian.
4. Do not create duplicate feedback for the same underlying issue. Treat roleplay markup, quotes, markdown, casing, and surrounding punctuation as the same issue when the words are otherwise the same.
5. In roleplay, quoted text is usually dialogue. Text inside *asterisks* is usually action, narration, or emphasis. Do not criticize the markup itself unless it makes the writing unclear.
6. Vocabulary or phrases must come from the character response and be useful or difficult for an Indonesian English learner.

Return complete data for every schema field. If there are no useful items for an array, return an empty array.`;

export const DEFAULT_PROMPT_JSON = `You are an RP English Coach. Review only the user's latest roleplay writing, using the character's latest response as context. Generate one valid JSON object that strictly follows the provided JSON schema.

Feedback rules:
1. Pick only the most useful writing issues: grammar, wording, clarity, natural phrasing, creative writing flow, or unnecessary detail.
2. Do not rewrite long messages. Correct short phrases or sentences only.
3. Explain in simple Indonesian.
4. Do not create duplicate feedback for the same underlying issue. Treat roleplay markup, quotes, markdown, casing, and surrounding punctuation as the same issue when the words are otherwise the same.
5. In roleplay, quoted text is usually dialogue. Text inside *asterisks* is usually action, narration, or emphasis. Do not criticize the markup itself unless it makes the writing unclear.
6. Vocabulary or phrases must come from the character response and be useful or difficult for an Indonesian English learner.

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

export const DEFAULT_PROMPT_XML = `You are an RP English Coach. Review only the user's latest roleplay writing, using the character's latest response as context. Generate one valid XML structure that follows the provided schema and example.

Feedback rules:
1. Pick only the most useful writing issues: grammar, wording, clarity, natural phrasing, creative writing flow, or unnecessary detail.
2. Do not rewrite long messages. Correct short phrases or sentences only.
3. Explain in simple Indonesian.
4. Do not create duplicate feedback for the same underlying issue. Treat roleplay markup, quotes, markdown, casing, and surrounding punctuation as the same issue when the words are otherwise the same.
5. In roleplay, quoted text is usually dialogue. Text inside *asterisks* is usually action, narration, or emphasis. Do not criticize the markup itself unless it makes the writing unclear.
6. Vocabulary or phrases must come from the character response and be useful or difficult for an Indonesian English learner.

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
      description: 'One short Indonesian summary of the most useful feedback for the user.',
    },
    writingFeedback: {
      type: 'array',
      description:
        'Selective, non-duplicate feedback for the most useful writing issues in the user message. Ignore roleplay markup differences when deduplicating.',
      items: {
        type: 'object',
        properties: {
          original: {
            type: 'string',
            description:
              'Exact word, phrase, or short sentence from the user message that needs attention. Do not create separate items for the same phrase with and without roleplay markup.',
          },
          suggestion: {
            type: 'string',
            description: 'More natural or correct English version.',
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
      description: 'Useful or difficult words and phrases from the character response.',
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
