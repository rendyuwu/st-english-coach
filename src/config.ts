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

export const extensionName = 'SillyTavern-WTracker';

export const DEFAULT_PROMPT = `You are an RP English Coach. Review the user's previous roleplay writing in the context of the character's latest response. Give selective, practical feedback for English learning without interrupting the roleplay.

Focus on:
1. The most useful writing issues only: grammar, wording, clarity, natural phrasing, creative writing flow, or unnecessary detail.
2. Short corrections, not full rewrites of long messages.
3. Indonesian explanations that are easy to understand.
4. Useful vocabulary or phrases from the character response that may be difficult for an English learner.

Return complete data for every schema field. If there are no useful items for an array, return an empty array.`;

export const DEFAULT_PROMPT_JSON = `You are a highly specialized AI assistant. Your SOLE purpose is to generate a single, valid JSON object that strictly adheres to the provided JSON schema.

**CRITICAL INSTRUCTIONS:**
1.  You MUST wrap the entire JSON object in a markdown code block (\`\`\`json\n...\n\`\`\`).
2.  Your response MUST NOT contain any explanatory text, comments, or any other content outside of this single code block.
3.  The JSON object inside the code block MUST be valid and conform to the schema.

**JSON SCHEMA TO FOLLOW:**
\`\`\`json
{{schema}}
\`\`\`

**EXAMPLE OF A PERFECT RESPONSE:**
\`\`\`json
{{example_response}}
\`\`\`
`;

export const DEFAULT_PROMPT_XML = `You are a highly specialized AI assistant. Your SOLE purpose is to generate a single, valid XML structure that strictly adheres to the provided example.

**CRITICAL INSTRUCTIONS:**
1.  You MUST wrap the entire XML object in a markdown code block (\`\`\`xml\n...\n\`\`\`).
2.  Your response MUST NOT contain any explanatory text, comments, or any other content outside of this single code block.
3.  The XML object inside the code block MUST be valid.

**JSON SCHEMA TO FOLLOW:**
\`\`\`json
{{schema}}
\`\`\`

**EXAMPLE OF A PERFECT RESPONSE:**
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
      description: 'Selective feedback for the most useful writing issues in the user message.',
      items: {
        type: 'object',
        properties: {
          original: {
            type: 'string',
            description: 'Exact word, phrase, or short sentence from the user message that needs attention.',
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
