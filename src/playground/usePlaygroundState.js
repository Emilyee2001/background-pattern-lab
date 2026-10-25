// @ts-check
// Playground 狀態：draft（欄位原始字串）、lastValid（各組最後有效值），applied 由兩者推導
import { useMemo, useReducer } from 'react';
import { getPatternControls } from '../patterns/common-controls.js';
import { BASE_DEFAULTS, baseControls } from '../patterns/_shared/index.js';
import { DEFAULT_PATTERN_ID, getPattern, patterns } from '../patterns/registry.js';
import { normalizeColor, toDraft, validateGroup } from './validation.js';

/** @typedef {'pattern' | 'base'} Group */

function createInitialState() {
  const pattern = getPattern(DEFAULT_PATTERN_ID);
  return {
    draft: {
      patternId: pattern.id,
      patterns: { [pattern.id]: toDraft(pattern.defaults) },
      base: toDraft(BASE_DEFAULTS),
    },
    lastValid: {
      patterns: Object.fromEntries(patterns.map((p) => [p.id, { ...p.defaults }])),
      base: { ...BASE_DEFAULTS },
    },
  };
}

function validatePatternDraft(patternId, draft) {
  const pattern = getPattern(patternId);
  return validateGroup(getPatternControls(pattern), draft, pattern.validate);
}

function validateBaseDraft(draft) {
  return validateGroup(baseControls, draft);
}

/** 更新某一組的 draft；整組有效時同步更新該組 lastValid */
function updateGroup(state, group, nextGroupDraft) {
  const { draft, lastValid } = state;

  if (group === 'base') {
    const result = validateBaseDraft(nextGroupDraft);
    return {
      draft: { ...draft, base: nextGroupDraft },
      lastValid: result.valid ? { ...lastValid, base: result.values } : lastValid,
    };
  }

  const id = draft.patternId;
  const result = validatePatternDraft(id, nextGroupDraft);
  return {
    draft: { ...draft, patterns: { ...draft.patterns, [id]: nextGroupDraft } },
    lastValid: result.valid
      ? { ...lastValid, patterns: { ...lastValid.patterns, [id]: result.values } }
      : lastValid,
  };
}

function currentGroupDraft(state, group) {
  return group === 'base' ? state.draft.base : state.draft.patterns[state.draft.patternId];
}

function reducer(state, action) {
  switch (action.type) {
    case 'selectPattern': {
      const { id } = action;
      const existing = state.draft.patterns[id];
      return {
        ...state,
        draft: {
          ...state.draft,
          patternId: id,
          patterns: existing
            ? state.draft.patterns
            : { ...state.draft.patterns, [id]: toDraft(state.lastValid.patterns[id]) },
        },
      };
    }
    case 'setField': {
      const groupDraft = currentGroupDraft(state, action.group);
      return updateGroup(state, action.group, { ...groupDraft, [action.key]: action.value });
    }
    case 'normalizeColor': {
      const groupDraft = currentGroupDraft(state, action.group);
      const normalized = normalizeColor(groupDraft[action.key]);
      if (normalized === groupDraft[action.key]) return state;
      return updateGroup(state, action.group, { ...groupDraft, [action.key]: normalized });
    }
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function usePlaygroundState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const { draft, lastValid } = state;

  const pattern = getPattern(draft.patternId);
  const patternDraft = draft.patterns[draft.patternId];

  const patternErrors = useMemo(
    () => validatePatternDraft(draft.patternId, patternDraft).errors,
    [draft.patternId, patternDraft],
  );
  const baseErrors = useMemo(() => validateBaseDraft(draft.base).errors, [draft.base]);

  const applied = useMemo(
    () => ({
      patternId: draft.patternId,
      pattern: lastValid.patterns[draft.patternId],
      base: lastValid.base,
    }),
    [draft.patternId, lastValid],
  );

  const actions = useMemo(
    () => ({
      selectPattern: (id) => dispatch({ type: 'selectPattern', id }),
      /** @param {Group} group */
      setField: (group, key, value) => dispatch({ type: 'setField', group, key, value }),
      /** @param {Group} group */
      normalizeColor: (group, key) => dispatch({ type: 'normalizeColor', group, key }),
    }),
    [],
  );

  return {
    pattern,
    patternDraft,
    patternErrors,
    baseDraft: draft.base,
    baseErrors,
    applied,
    actions,
  };
}
