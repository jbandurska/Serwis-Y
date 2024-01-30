import axios from 'axios';
import { topOfWindowSub } from '../utils/topOfWindowSub';
import { bottomOfWindowSub } from '../utils/bottomOfWindowSub';

const MAX = 30;

let _threadsArray;
let _urlPath;
let _onNewThreads;
let _lastThreadId;

let unsubscribeTop;
let unsubscribeBottom;

const scrollCurrentIntoView = (id) => {
  if (id) {
    setTimeout(() => {
      const currentThread = document.getElementById(`thread:${id}`);

      if (currentThread) currentThread.scrollIntoView({ block: 'center', inline: 'center' });
    });
  }
};

const init = (arrayRef, path, onNewThreadsCb) => {
  _threadsArray = arrayRef;
  _urlPath = path;
  _onNewThreads = onNewThreadsCb;

  unsubscribeTop = topOfWindowSub(() => {
    if (_threadsArray.value.length) {
      getThreads(true);
    }
  });

  unsubscribeBottom = bottomOfWindowSub(() => {
    if (_threadsArray.value.length) {
      getThreads(false);
    }
  });

  getThreads();
};

const setPath = (path, refresh = true) => {
  _urlPath = path;

  if (refresh) getThreads();
};

const destroy = () => {
  _threadsArray = undefined;
  _urlPath = undefined;
  _onNewThreads = undefined;

  unsubscribeTop();
  unsubscribeBottom();
};

const getThreadsAround = async (threadId) => {
  if (!_threadsArray || !_urlPath || !threadId) {
    return new Error('Threads array, threadId and url path must be provided!');
  }

  try {
    const response = await axios.get(_urlPath, {
      withCredentials: true,
      params: {
        threadId,
        time_direction: 'around'
      }
    });
    const threads = response.data.threads;

    if (threads.length > 0) {
      _threadsArray.value.push(...threads);
      _threadsArray.value = _threadsArray.value.slice(-MAX);
      scrollCurrentIntoView(threadId);
    }
  } catch (error) {
    alert('Something went wrong :(');
  }
};

const getNewestThreads = async () => {
  if (!_threadsArray || !_urlPath) {
    return new Error('Threads array and url path must be provided!');
  }

  try {
    const response = await axios.get(_urlPath, {
      withCredentials: true
    });
    const threads = response.data.threads;
    _threadsArray.value = threads;
  } catch (error) {
    alert('Something went wrong :(');
  }
};

const getThreads = async (newer = false) => {
  if (!_threadsArray || !_urlPath) {
    return new Error('Threads array and url path must be provided!');
  }

  const lastThreadId = newer ? _threadsArray.value.at(0)?._id : _threadsArray.value.at(-1)?._id;

  if (lastThreadId && !newer && lastThreadId === _lastThreadId) {
    // for cases when onscroll event gets fired twice when
    // is less than 1 px away from the bottom of the screen
    return;
  }

  _lastThreadId = lastThreadId;

  const id = _threadsArray.value.at(0)?._id;

  try {
    const response = await axios.get(_urlPath, {
      withCredentials: true,
      params: {
        threadId: lastThreadId,
        time_direction: newer ? 'newer' : 'older'
      }
    });
    const threads = response.data.threads;

    if (_onNewThreads) _onNewThreads(newer, threads.length);

    if (threads.length > 0 && newer) {
      _threadsArray.value.unshift(...threads);
      _threadsArray.value = _threadsArray.value.slice(0, MAX);
      scrollCurrentIntoView(id);
    } else if (threads.length > 0) {
      _threadsArray.value.push(...threads);
      _threadsArray.value = _threadsArray.value.slice(-MAX);
    }
  } catch (error) {
    alert('Something went wrong :(');
  }
};

export const paginationService = {
  init,
  setPath,
  destroy,
  getNewestThreads,
  getThreadsAround
};
