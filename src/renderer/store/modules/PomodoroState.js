const state = {
  workRoundInSeconds: 1500,
  shortBreakInSeconds: 300,
  longBreakInSeconds: 900,
  currentIteration: 1,
  currentSlotName: 'work', // work, short-break, long-break
  isTimerStarted: false
}

const mutations = {
  START_TIMER (state) {
    state.isTimerStarted = true
  },
  PAUSE_TIMER (state) {
    state.isTimerStarted = false
  },
  MOVE_TO_NEXT_SLOT (state) {
    state.currentIteration++
    if (state.currentSlotName === 'work' && state.currentIteration % 8 !== 0) {
      state.currentSlotName = 'short-break'
    } else if (state.currentSlotName === 'work' && state.currentIteration % 8 === 0) {
      state.currentSlotName = 'long-break'
    } else {
      state.currentSlotName = 'work'
    }
    if (state.currentIteration > 16) {
      state.currentIteration = 1
    }
  }
}

const actions = {
  startTimer ({ commit }) {
    // do something async
    commit('START_TIMER')
  },
  pauseTimer ({ commit }) {
    // do something async
    commit('PAUSE_TIMER')
  },
  moveToNextSlot ({ commit }) {
    commit('MOVE_TO_NEXT_SLOT')
  }
}

const getters = {
  currentTimerValue () {
    switch (state.currentSlotName) {
      case 'work':
        return state.workRoundInSeconds
      case 'short-break':
        return state.shortBreakInSeconds
      case 'long-break':
        return state.longBreakInSeconds
      default:
        return 1500
    }
  },
  currentSlotName () {
    return state.currentSlotName
  },
  workRoundInSeconds () {
    return state.workRoundInSeconds
  },
  shortBreakInSeconds () {
    return state.shortBreakInSeconds
  },
  longBreakInSeconds () {
    return state.shortBreakInSeconds
  },
  isTimerInProgress () {
    return state.isTimerStarted
  },
  getCurrentIteration () {
    return state.currentIteration
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}
