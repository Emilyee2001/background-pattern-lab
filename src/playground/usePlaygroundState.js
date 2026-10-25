// @ts-check
// Playground 狀態：draft（欄位原始字串）、lastValid（各組最後有效值），applied 由兩者推導
//
// Pattern 參數依 level 分組：'default' 為預設（最小尺寸），'md'／'lg' 為 RWD 斷點。
// 每個 level 與底色各自是一個驗證組，互不阻擋。
import { useMemo, useReducer } from 'react';
import { BREAKPOINTS } from '../export/breakpoints.js';
import { getPatternControls } from '../patterns/common-controls.js';
import { BASE_DEFAULTS, baseControls } from '../patterns/_shared/index.js';
import { DEFAULT_PATTERN_ID, getPattern, patterns } from '../patterns/registry.js';
import { normalizeColor, toDraft, validateGroup } from './validation.js';

/** @typedef {'default' | 'md' | 'lg'} Level */
/** 'base' 為底色，其餘為 pattern 的 level @typedef {'base' | Level} Target */

function createInitialState() {
  const pattern = getPattern(DEFAULT_PATTERN_ID);
  return {
    draft: {
      patternId: pattern.id,
      responsive: { enabled: false, breakpoints: /** @type {Level[]} */ ([]) },
      patterns: { [pattern.id]: { default: toDraft(pattern.defaults) } },
      base: toDraft(BASE_DEFAULTS),
    },
    lastValid: {
      patterns: Object.fromEntries(patterns.map((p) => [p.id, { default: { ...p.defaults } }])),
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

/** 目前顯示中的 level：預設 + 已啟用的斷點 */
function visibleLevels(responsive) {
  return ['default', ...(responsive.enabled ? responsive.breakpoints : [])];
}

/**
 * 補齊某款 pattern 缺少的斷點值與草稿：從上一層的最後有效值複製
 * （md 複製預設、lg 複製 md），使用者只需修改想改的欄位。
 */
function ensureLevels(state, patternId) {
  const { draft, lastValid } = state;
  const valid = { ...lastValid.patterns[patternId] };
  const patternDraft = { ...(draft.patterns[patternId] ?? { default: toDraft(valid.default) }) };

  draft.responsive.breakpoints.forEach((level, i) => {
    const prev = i === 0 ? 'default' : draft.responsive.breakpoints[i - 1];
    if (!valid[level]) valid[level] = { ...valid[prev] };
    if (!patternDraft[level]) patternDraft[level] = toDraft(valid[level]);
  });

  return {
    draft: { ...draft, patterns: { ...draft.patterns, [patternId]: patternDraft } },
    lastValid: { ...lastValid, patterns: { ...lastValid.patterns, [patternId]: valid } },
  };
}

/** 更新某一組的 draft；整組有效時同步更新該組 lastValid */
function updateGroup(state, target, nextGroupDraft) {
  const { draft, lastValid } = state;

  if (target === 'base') {
    const result = validateBaseDraft(nextGroupDraft);
    return {
      draft: { ...draft, base: nextGroupDraft },
      lastValid: result.valid ? { ...lastValid, base: result.values } : lastValid,
    };
  }

  const id = draft.patternId;
  const result = validatePatternDraft(id, nextGroupDraft);
  return {
    draft: {
      ...draft,
      patterns: { ...draft.patterns, [id]: { ...draft.patterns[id], [target]: nextGroupDraft } },
    },
    lastValid: result.valid
      ? {
          ...lastValid,
          patterns: { ...lastValid.patterns, [id]: { ...lastValid.patterns[id], [target]: result.values } },
        }
      : lastValid,
  };
}

function groupDraft(state, target) {
  return target === 'base' ? state.draft.base : state.draft.patterns[state.draft.patternId][target];
}

function withResponsive(state, responsive) {
  return { ...state, draft: { ...state.draft, responsive } };
}

function reducer(state, action) {
  switch (action.type) {
    case 'selectPattern':
      return ensureLevels({ ...state, draft: { ...state.draft, patternId: action.id } }, action.id);
    case 'setField': {
      const current = groupDraft(state, action.target);
      return updateGroup(state, action.target, { ...current, [action.key]: action.value });
    }
    case 'normalizeColor': {
      const current = groupDraft(state, action.target);
      const normalized = normalizeColor(current[action.key]);
      if (normalized === current[action.key]) return state;
      return updateGroup(state, action.target, { ...current, [action.key]: normalized });
    }
    case 'toggleResponsive': {
      const { enabled, breakpoints } = state.draft.responsive;
      const next = withResponsive(state, {
        enabled: !enabled,
        breakpoints: !enabled && breakpoints.length === 0 ? [BREAKPOINTS[0].id] : breakpoints,
      });
      return ensureLevels(next, state.draft.patternId);
    }
    case 'addBreakpoint': {
      const { breakpoints } = state.draft.responsive;
      const nextBp = BREAKPOINTS.find((bp) => !breakpoints.includes(bp.id));
      if (!nextBp) return state;
      const next = withResponsive(state, { enabled: true, breakpoints: [...breakpoints, nextBp.id] });
      return ensureLevels(next, state.draft.patternId);
    }
    case 'removeBreakpoint': {
      // 刪除後各 pattern 的該斷點值一併清除，重新加入時再從上一層複製
      const index = state.draft.responsive.breakpoints.indexOf(action.id);
      if (index === -1) return state;
      const removed = state.draft.responsive.breakpoints.slice(index);
      const strip = (byPattern) =>
        Object.fromEntries(
          Object.entries(byPattern).map(([id, levels]) => [
            id,
            Object.fromEntries(Object.entries(levels).filter(([level]) => !removed.includes(level))),
          ]),
        );
      return {
        draft: {
          ...state.draft,
          responsive: { ...state.draft.responsive, breakpoints: state.draft.responsive.breakpoints.slice(0, index) },
          patterns: strip(state.draft.patterns),
        },
        lastValid: { ...state.lastValid, patterns: strip(state.lastValid.patterns) },
      };
    }
    default:
      throw new Error(`Unknown action: ${action.type}`);
  }
}

export function usePlaygroundState() {
  const [state, dispatch] = useReducer(reducer, undefined, createInitialState);
  const { draft, lastValid } = state;
  const { patternId, responsive } = draft;

  const pattern = getPattern(patternId);
  const patternDraft = draft.patterns[patternId];
  const patternValid = lastValid.patterns[patternId];

  const patternErrors = useMemo(
    () =>
      Object.fromEntries(
        Object.entries(patternDraft).map(([level, values]) => [level, validatePatternDraft(patternId, values).errors]),
      ),
    [patternId, patternDraft],
  );
  const baseErrors = useMemo(() => validateBaseDraft(draft.base).errors, [draft.base]);

  const applied = useMemo(
    () => ({
      patternId,
      pattern: patternValid.default,
      breakpoints: visibleLevels(responsive)
        .slice(1)
        .map((id) => ({ id, values: patternValid[id] })),
      base: lastValid.base,
    }),
    [patternId, patternValid, responsive, lastValid.base],
  );

  const actions = useMemo(
    () => ({
      selectPattern: (id) => dispatch({ type: 'selectPattern', id }),
      /** @param {Target} target */
      setField: (target, key, value) => dispatch({ type: 'setField', target, key, value }),
      /** @param {Target} target */
      normalizeColor: (target, key) => dispatch({ type: 'normalizeColor', target, key }),
      toggleResponsive: () => dispatch({ type: 'toggleResponsive' }),
      addBreakpoint: () => dispatch({ type: 'addBreakpoint' }),
      /** @param {Level} id */
      removeBreakpoint: (id) => dispatch({ type: 'removeBreakpoint', id }),
    }),
    [],
  );

  return {
    pattern,
    patternDraft,
    patternValid,
    patternErrors,
    responsive,
    baseDraft: draft.base,
    baseErrors,
    applied,
    actions,
  };
}
