import { omit } from 'lodash';
import { SET_SOURCE_AND_SCREENSHOT, QUIT_SESSION_REQUESTED, QUIT_SESSION_DONE,
         SESSION_DONE, SELECT_ELEMENT, UNSELECT_ELEMENT, SELECT_HOVERED_ELEMENT, SET_SELECTED_ELEMENT_ID, SET_INTERACTIONS_NOT_AVAILABLE,
         UNSELECT_HOVERED_ELEMENT, METHOD_CALL_REQUESTED, METHOD_CALL_DONE,
         SET_FIELD_VALUE, SET_EXPANDED_PATHS, SHOW_SEND_KEYS_MODAL,
         HIDE_SEND_KEYS_MODAL, START_RECORDING, PAUSE_RECORDING, CLEAR_RECORDING,
         SET_ACTION_FRAMEWORK, RECORD_ACTION, CLOSE_RECORDER, SET_SHOW_BOILERPLATE, SET_SESSION_DETAILS,
         SHOW_LOCATOR_TEST_MODAL, HIDE_LOCATOR_TEST_MODAL, SET_LOCATOR_TEST_STRATEGY, SET_LOCATOR_TEST_VALUE,
         SEARCHING_FOR_ELEMENTS, SEARCHING_FOR_ELEMENTS_COMPLETED, SET_LOCATOR_TEST_ELEMENT, CLEAR_SEARCH_RESULTS,
         ADD_ASSIGNED_VAR_CACHE, CLEAR_ASSIGNED_VAR_CACHE, SET_SCREENSHOT_INTERACTION_MODE,
         SET_SWIPE_START, SET_SWIPE_END, CLEAR_SWIPE_ACTION, SET_SEARCHED_FOR_ELEMENT_BOUNDS, CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS,
         PROMPT_KEEP_ALIVE, HIDE_PROMPT_KEEP_ALIVE, GET_FIND_ELEMENTS_TIMES, GET_FIND_ELEMENTS_TIMES_COMPLETED,
         SELECT_ACTION_GROUP, SELECT_SUB_ACTION_GROUP, SET_APP_MODE,
         SELECT_INTERACTION_MODE, ENTERING_ACTION_ARGS, SET_ACTION_ARG, REMOVE_ACTION, SET_CONTEXT,
         SET_KEEP_ALIVE_INTERVAL, SET_USER_WAIT_TIMEOUT, SET_LAST_ACTIVE_MOMENT, SET_VISIBLE_COMMAND_RESULT,
         SET_AWAITING_MJPEG_STREAM, SET_APP_ID, SET_SERVER_STATUS, SET_SESSION_TIME, SHOW_GESTURE_EDITOR, HIDE_GESTURE_EDITOR, SET_SAVED_GESTURES,
         GET_SAVED_GESTURES_REQUESTED, GET_SAVED_GESTURES_DONE, SET_LOADED_GESTURE, REMOVE_LOADED_GESTURE, SHOW_GESTURE_ACTION, HIDE_GESTURE_ACTION,
         SELECT_TICK_ELEMENT, UNSELECT_TICK_ELEMENT, SET_GESTURE_TAP_COORDS_MODE, CLEAR_TAP_COORDINATES, DELETE_SAVED_GESTURES_REQUESTED, DELETE_SAVED_GESTURES_DONE,
         SELECT_HOVERED_CENTROID, UNSELECT_HOVERED_CENTROID, SELECT_CENTROID, UNSELECT_CENTROID,
         SET_SHOW_CENTROIDS,
} from '../actions/Inspector';
import { SCREENSHOT_INTERACTION_MODE, INTERACTION_MODE, APP_MODE } from '../components/Inspector/shared';

const DEFAULT_FRAMEWORK = 'java';

const INITIAL_STATE = {
  savedGestures: [],
  driver: null,
  keepAliveInterval: null,
  showKeepAlivePrompt: false,
  userWaitTimeout: null,
  lastActiveMoment: null,
  expandedPaths: ['0'],
  isRecording: false,
  showRecord: false,
  showBoilerplate: false,
  recordedActions: [],
  actionFramework: DEFAULT_FRAMEWORK,
  sessionDetails: {},
  isGestureEditorVisible: false,
  isLocatorTestModalVisible: false,
  showCentroids: false,
  locatorTestStrategy: 'id',
  locatorTestValue: '',
  isSearchingForElements: false,
  assignedVarCache: {},
  screenshotInteractionMode: SCREENSHOT_INTERACTION_MODE.SELECT,
  searchedForElementBounds: null,
  selectedActionGroup: null,
  selectedSubActionGroup: null,
  selectedInteractionMode: INTERACTION_MODE.SOURCE,
  appMode: APP_MODE.NATIVE,
  mjpegScreenshotUrl: null,
  pendingAction: null,
  findElementsExecutionTimes: [],
  isFindingElementsTimes: false,
  visibleCommandResult: null,
  visibleCommandMethod: null,
  isAwaitingMjpegStream: true,
};

let nextState;

/**
 * Look up an element in the source with the provided path
 */
function findElementByPath (path, source) {
  let selectedElement = source;
  for (let index of path.split('.')) {
    selectedElement = selectedElement.children[index];
  }
  return {...selectedElement};
}

export default function inspector (state = INITIAL_STATE, action) {
  switch (action.type) {
    case SET_SOURCE_AND_SCREENSHOT:
      return {
        ...state,
        contexts: action.contexts,
        contextsError: action.contextsError,
        currentContext: action.currentContext,
        currentContextError: action.currentContextError,
        source: action.source,
        sourceXML: action.sourceXML,
        sourceError: action.sourceError,
        screenshot: action.screenshot,
        screenshotError: action.screenshotError,
        windowSize: action.windowSize,
        windowSizeError: action.windowSizeError,
        findElementsExecutionTimes: [],
      };

    case QUIT_SESSION_REQUESTED:
      return {
        ...state,
        methodCallInProgress: true,
        isQuittingSession: true,
      };

    case QUIT_SESSION_DONE:
      return {
        ...INITIAL_STATE
      };

    case SESSION_DONE:
      return {
        ...state,
        isSessionDone: true,
        methodCallInProgress: false,
      };

    case SELECT_ELEMENT:
      return {
        ...state,
        selectedElement: findElementByPath(action.path, state.source),
        selectedElementPath: action.path,
        elementInteractionsNotAvailable: false,
        findElementsExecutionTimes: [],
      };

    case UNSELECT_ELEMENT:
      return {
        ...state,
        selectedElement: undefined,
        selectedElementPath: null,
        selectedElementId: null,
        selectedElementVariableName: null,
        selectedElementVariableType: null,
      };

    case SELECT_CENTROID:
      return {
        ...state,
        selectedCentroid: action.path,
      };

    case UNSELECT_CENTROID:
      return omit(state, 'selectedCentroid');

    case SET_SELECTED_ELEMENT_ID:
      return {
        ...state,
        selectedElementId: action.elementId,
        selectedElementVariableName: action.variableName,
        selectedElementVariableType: action.variableType,
        findElementsExecutionTimes: [],
      };

    case SET_INTERACTIONS_NOT_AVAILABLE:
      return {
        ...state,
        elementInteractionsNotAvailable: true,
      };

    case SELECT_HOVERED_ELEMENT:
      return {
        ...state,
        hoveredElement: findElementByPath(action.path, state.source),
      };

    case UNSELECT_HOVERED_ELEMENT:
      return omit(state, 'hoveredElement');

    case SELECT_HOVERED_CENTROID:
      return {
        ...state,
        hoveredCentroid: action.path,
      };

    case UNSELECT_HOVERED_CENTROID:
      return omit(state, 'hoveredCentroid');

    case METHOD_CALL_REQUESTED:
      return {
        ...state,
        methodCallInProgress: true,
      };

    case METHOD_CALL_DONE:
      return {
        ...state,
        methodCallInProgress: false,
      };

    case SET_FIELD_VALUE:
      return {
        ...state,
        [action.name]: action.value,
      };

    case SET_EXPANDED_PATHS:
      return {
        ...state,
        expandedPaths: action.paths,
        findElementsExecutionTimes: [],
      };

    case SHOW_SEND_KEYS_MODAL:
      return {
        ...state,
        sendKeysModalVisible: true
      };

    case HIDE_SEND_KEYS_MODAL:
      return {
        ...state,
        sendKeysModalVisible: false,
        action: {
          ...state.action,
          sendKeys: null,
        }
      };

    case START_RECORDING:
      return {
        ...state,
        isRecording: true,
        showRecord: true
      };

    case PAUSE_RECORDING:
      return {
        ...state,
        isRecording: false,
        showRecord: state.recordedActions.length > 0
      };

    case CLEAR_RECORDING:
      return {
        ...state,
        recordedActions: []
      };

    case SET_ACTION_FRAMEWORK:
      return {
        ...state,
        actionFramework: action.framework || DEFAULT_FRAMEWORK
      };

    case RECORD_ACTION:
      return {
        ...state,
        recordedActions: [
          ...state.recordedActions,
          {action: action.action, params: action.params}
        ]
      };

    case ADD_ASSIGNED_VAR_CACHE:
      return {
        ...state,
        assignedVarCache: {
          ...state.assignedVarCache,
          [action.varName]: true,
        }
      };

    case CLEAR_ASSIGNED_VAR_CACHE:
      return {
        ...state,
        assignedVarCache: [],
      };

    case CLOSE_RECORDER:
      return {
        ...state,
        showRecord: false
      };

    case SET_SHOW_BOILERPLATE:
      return {...state, showBoilerplate: action.show};

    case SET_SESSION_DETAILS:
      return {
        ...state,
        sessionDetails: action.sessionDetails,
        driver: action.driver,
        appMode: action.mode,
        mjpegScreenshotUrl: action.mjpegScreenshotUrl
      };

    case SHOW_LOCATOR_TEST_MODAL:
      return {
        ...state,
        isLocatorTestModalVisible: true,
      };

    case HIDE_LOCATOR_TEST_MODAL:
      return {
        ...state,
        isLocatorTestModalVisible: false,
      };

    case SET_LOCATOR_TEST_STRATEGY:
      return {
        ...state,
        locatorTestStrategy: action.locatorTestStrategy
      };

    case SET_LOCATOR_TEST_VALUE:
      return {
        ...state,
        locatorTestValue: action.locatorTestValue
      };

    case SEARCHING_FOR_ELEMENTS:
      return {
        ...state,
        locatedElements: null,
        locatorTestElement: null,
        isSearchingForElements: true,
      };

    case SEARCHING_FOR_ELEMENTS_COMPLETED:
      return {
        ...state,
        locatedElements: action.elements,
        isSearchingForElements: false,
      };

    case GET_FIND_ELEMENTS_TIMES:
      return {
        ...state,
        isFindingElementsTimes: true,
      };

    case GET_FIND_ELEMENTS_TIMES_COMPLETED:
      return {
        ...state,
        findElementsExecutionTimes: action.findElementsExecutionTimes,
        isFindingElementsTimes: false,
      };

    case SET_LOCATOR_TEST_ELEMENT:
      return {
        ...state,
        locatorTestElement: action.elementId,
      };

    case CLEAR_SEARCH_RESULTS:
      return {
        ...state,
        locatedElements: null,
      };

    case SET_SCREENSHOT_INTERACTION_MODE:
      return {
        ...state,
        screenshotInteractionMode: action.screenshotInteractionMode,
      };

    case SET_SWIPE_START:
      return {
        ...state,
        swipeStart: {
          x: action.swipeStartX,
          y: action.swipeStartY,
        },
      };

    case SET_SWIPE_END:
      return {
        ...state,
        swipeEnd: {
          x: action.swipeEndX,
          y: action.swipeEndY,
        },
      };

    case CLEAR_SWIPE_ACTION:
      return {
        ...state,
        swipeStart: null,
        swipeEnd: null,
      };

    case SET_SEARCHED_FOR_ELEMENT_BOUNDS:
      return {
        ...state,
        searchedForElementBounds: {
          location: action.location,
          size: action.size,
        }
      };

    case CLEAR_SEARCHED_FOR_ELEMENT_BOUNDS:
      return {
        ...state,
        searchedForElementBounds: null,
      };

    case PROMPT_KEEP_ALIVE:
      return {
        ...state,
        showKeepAlivePrompt: true,
      };

    case HIDE_PROMPT_KEEP_ALIVE:
      return {
        ...state,
        showKeepAlivePrompt: false,
      };

    case SELECT_ACTION_GROUP:
      return {
        ...state,
        selectedActionGroup: action.group
      };

    case SELECT_SUB_ACTION_GROUP:
      return {
        ...state,
        selectedSubActionGroup: action.group,
      };

    case SELECT_INTERACTION_MODE:
      return {
        ...state,
        selectedInteractionMode: action.interaction,
      };

    case SET_APP_MODE:
      return {
        ...state,
        appMode: action.mode,
      };

    case SET_SHOW_CENTROIDS:
      return {
        ...state,
        showCentroids: action.show,
      };

    case ENTERING_ACTION_ARGS:
      return {
        ...state,
        pendingAction: {
          actionName: action.actionName,
          action: action.action,
          args: [],
        }
      };

    case SET_ACTION_ARG:
      return {
        ...state,
        pendingAction: {
          ...state.pendingAction,
          args: Object.assign([], state.pendingAction.args, {[action.index]: action.value}), // Replace 'value' at 'index'
        },
      };

    case REMOVE_ACTION:
      return {
        ...state,
        pendingAction: null,
      };

    case SET_CONTEXT:
      return {
        ...state,
        currentContext: action.context
      };

    case SET_KEEP_ALIVE_INTERVAL:
      return {
        ...state,
        keepAliveInterval: action.keepAliveInterval,
      };

    case SET_USER_WAIT_TIMEOUT:
      return {
        ...state,
        userWaitTimeout: null,
      };

    case SET_LAST_ACTIVE_MOMENT:
      return {
        ...state,
        lastActiveMoment: action.lastActiveMoment,
      };

    case SET_VISIBLE_COMMAND_RESULT:
      return {
        ...state,
        visibleCommandResult: action.result,
        visibleCommandMethod: action.methodName,
      };

    case SET_SESSION_TIME:
      return {
        ...state,
        sessionStartTime: action.sessionStartTime,
      };

    case SET_APP_ID:
      return {
        ...state,
        appId: action.appId,
      };

    case SET_SERVER_STATUS:
      return {
        ...state,
        status: action.status,
      };

    case SET_AWAITING_MJPEG_STREAM:
      return {...state, isAwaitingMjpegStream: action.isAwaiting};

    case SHOW_GESTURE_EDITOR:
      return {
        ...state,
        isGestureEditorVisible: true,
      };

    case HIDE_GESTURE_EDITOR:
      return {
        ...state,
        isGestureEditorVisible: false,
      };

    case SET_SAVED_GESTURES:
      return {
        ...state,
        savedGestures: action.savedGestures,
      };

    case GET_SAVED_GESTURES_REQUESTED:
      return {
        ...state,
        getSavedGesturesRequested: true,
      };

    case GET_SAVED_GESTURES_DONE:
      nextState = {
        ...state,
        savedGestures: action.savedGestures || [],
      };
      return omit(nextState, 'getSavedGesturesRequested');

    case DELETE_SAVED_GESTURES_REQUESTED:
      return {
        ...state,
        deleteGesture: action.deleteGesture,
      };

    case DELETE_SAVED_GESTURES_DONE:
      return omit(state, 'deleteGesture');

    case SET_LOADED_GESTURE:
      return {
        ...state,
        loadedGesture: action.loadedGesture,
      };

    case REMOVE_LOADED_GESTURE:
      return omit(state, 'loadedGesture');

    case SHOW_GESTURE_ACTION:
      return {
        ...state,
        showGesture: action.showGesture,
      };

    case HIDE_GESTURE_ACTION:
      return omit(state, 'showGesture');

    case SELECT_TICK_ELEMENT:
      return {
        ...state,
        selectedTick: action.selectedTick,
      };

    case UNSELECT_TICK_ELEMENT:
      return omit(state, 'selectedTick');

    case SET_GESTURE_TAP_COORDS_MODE:
      return {
        ...state,
        tickCoordinates: {
          x: action.x,
          y: action.y,
        },
      };

    case CLEAR_TAP_COORDINATES:
      return omit(state, 'tickCoordinates');

    default:
      return {...state};
  }
}
