import axios from 'axios';
import { topOfWindowSub } from '../utils/topOfWindowSub';
import { bottomOfWindowSub } from '../utils/bottomOfWindowSub';

const MAX = 30;

let _threadsArray;
let _urlPath;
let _onNewThreads;

let unsubscribeTop;
let unsubscribeBottom;

const scrollCurrentIntoView = (id) => {
  if (id) {
    const currentThread = document.getElementById(`thread:${id}`);

    if (currentThread)
      setTimeout(() => {
        currentThread.scrollIntoView({ block: 'center', inline: 'center' });
      });
  }
};

const init = (arrayRef, path, onNewThreadsCb) => {
  _threadsArray = arrayRef;
  _urlPath = path;
  _onNewThreads = onNewThreadsCb;

  unsubscribeTop = topOfWindowSub(() => {
    getThreads(true);
  });

  unsubscribeBottom = bottomOfWindowSub(() => {
    getThreads(false);
  });

  getThreads();
};

const setPath = (path) => {
  _urlPath = path;
  getThreads();
};

const destroy = () => {
  _threadsArray = undefined;
  _urlPath = undefined;
  _onNewThreads = undefined;

  unsubscribeTop();
  unsubscribeBottom();
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

  const lastCreatedAt = newer
    ? _threadsArray.value.at(0)?.createdAt
    : _threadsArray.value.at(-1)?.createdAt;

  const id = _threadsArray.value.at(0)?._id;

  try {
    const response = await axios.get(_urlPath, {
      withCredentials: true,
      params: {
        createdAt: lastCreatedAt,
        newer
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
  getNewestThreads
};
