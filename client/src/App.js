import { Fragment, useState, useRef, useEffect } from 'react'
import {
  FaceFrownIcon,
  FaceSmileIcon,
  FireIcon,
  HandThumbUpIcon,
  HeartIcon,
  PaperClipIcon,
  XMarkIcon,
  ChatBubbleLeftEllipsisIcon,
  TagIcon,
  UserCircleIcon
} from '@heroicons/react/20/solid'
import { Listbox, Transition } from '@headlessui/react'
import axios from 'axios'
import Markdown from 'markdown-to-jsx'

import Navbar from './Components/Navbar'
import './App.css'


const moods = [
  { name: 'Excited', value: 'excited', icon: FireIcon, iconColor: 'text-white', bgColor: 'bg-red-500' },
  { name: 'Loved', value: 'loved', icon: HeartIcon, iconColor: 'text-white', bgColor: 'bg-pink-400' },
  { name: 'Happy', value: 'happy', icon: FaceSmileIcon, iconColor: 'text-white', bgColor: 'bg-green-400' },
  { name: 'Sad', value: 'sad', icon: FaceFrownIcon, iconColor: 'text-white', bgColor: 'bg-yellow-400' },
  { name: 'Thumbsy', value: 'thumbsy', icon: HandThumbUpIcon, iconColor: 'text-white', bgColor: 'bg-blue-500' },
  { name: 'I feel nothing', value: null, icon: XMarkIcon, iconColor: 'text-gray-400', bgColor: 'bg-transparent' },
]

const activity = [
  {
    id: 1,
    type: 'comment',
    person: { name: 'Assistant', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1520785643438-5bf77931f493?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. ',
    date: '6d ago',
  },
  {
    id: 4,
    type: 'comment',
    person: { name: 'User', href: '#' },
    imageUrl:
      'https://images.unsplash.com/photo-1531427186611-ecfd6d936c79?ixlib=rb-=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=8&w=256&h=256&q=80',
    comment:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Tincidunt nunc ipsum tempor purus vitae id. Morbi in vestibulum nec varius. Et diam cursus quis sed purus nam. Scelerisque amet elit non sit ut tincidunt condimentum. Nisl ultrices eu venenatis diam.',
    date: '2h ago',
  },
]

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

export default function App() {
  const [selected, setSelected] = useState(moods[5])
  const [loading, setLoading] = useState(false)
  const [userInput, setUserInput] = useState('')
  const [messageHistory, setMessageHistory] = useState([])
  const [threadID, setThreadID] = useState('')
  const [recentComment, setRecentComment] = useState('')

  const handleInput = (e) => {
    setUserInput(e.target.value)
  }

  const clickHandler = async (e) => {
    e.preventDefault()
    setRecentComment(userInput)
    setUserInput('')
    setLoading(true)
    try {
      const response = await axios({
        method: 'post',
        url: 'api/openai/agent',
        data: {
          message: userInput,
          threadID: threadID
        }
      })
      setLoading(false)
      setRecentComment('')
      // setMessageHistory([...messageHistory, { role: 'user', content: userInput }, response.data])
      console.log(response)
      setThreadID(response.data.messages.data[0].thread_id)
      setMessageHistory(response.data.messages.data.reverse())
    } catch (error) {
      setLoading(false)
      console.log(error)
    }
  }

  const timeConvert = (timestamp) => {
    const now = new Date().getTime();
    const secondsPast = (now - timestamp * 1000) / 1000;

    if (secondsPast < 60) {
      return `${Math.round(secondsPast)} seconds ago`;
    } else if (secondsPast < 3600) {
      return `${Math.round(secondsPast / 60)} minutes ago`;
    } else if (secondsPast <= 86400) {
      return `${Math.round(secondsPast / 3600)} hours ago`;
    } else {
      return `${Math.round(secondsPast / 86400)} days ago`;
    }
  }

  const endOfMessagesRef = useRef(null);

  const scrollToBottom = () => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const linkComp = ({ children, ...props }) => <a  target="_blank" {...props}>{children}</a>

  useEffect(() => {
    scrollToBottom();
  }, [messageHistory, recentComment]);

  return (
    <>
      <div className="min-h-full">
        <Navbar />
        <div className="py-10">
          <header>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">Chat</h1>
            </div>
          </header>
          <main>
            <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
              {/* content  */}
              <div className="flow-root content scrollbox">
                <ul role="list" className="-mb-8">
                  <li>
                    <div className="relative pb-8">

                      <div className="relative flex items-start space-x-3">

                        <>
                          <div className="relative">

                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <a href='#' className="font-medium text-zoodealiogreen">
                                  AI
                                </a>
                              </div>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              Ask Me a question!
                            </div>
                          </div>
                        </>

                      </div>
                    </div>
                  </li>
                  {messageHistory.map((item, key) => {
                    return (
                      (

                        <li key={key}>
                          <div className="relative pb-8">

                            <div className="relative flex items-start space-x-3">

                              <>
                                <div className="relative">

                                </div>
                                <div className="min-w-0 flex-1">
                                  <div>
                                    <div className="text-sm">
                                      {item.role === 'assistant' ?
                                        <a href='#' className="font-medium text-zoodealiogreen">
                                          {item.role}
                                        </a>
                                        : <a href='#' className="font-medium text-zoodealioblue">
                                          {item.role}
                                        </a>}
                                    </div>
                                    <p className="mt-0.5 text-sm text-gray-500">{timeConvert(item.created_at).toString()}</p>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-700">
                                    <Markdown
                                      options={{
                                        overrides: {
                                          a: {
                                            component: linkComp,
                                            props: {
                                              className: 'text-zoodealioblue link',
                                            },
                                          },
                                        },
                                      }}
                                    >{item.content[0].text.value}</Markdown>
                                  </div>
                                </div>
                              </>

                            </div>
                          </div>
                        </li>
                      )
                    )
                  })}
                  {recentComment ? <li>
                    <div className="relative pb-8">
                      {/* {key !== messageHistory.length - 1 ? (
                                         <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                       ) : null} */}
                      <div className="relative flex items-start space-x-3">

                        <>
                          <div className="relative">
                            {/* <img
                                                 className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                                 src={activityItem.imageUrl}
                                                 alt=""
                                               /> */}
                            {/*     
                                               <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
                                                 <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                               </span> */}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <a href='#' className="font-medium text-gray-900">
                                  You
                                </a>
                              </div>
                              <p className="mt-0.5 text-sm text-gray-500">Commented Now</p>
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>{recentComment}</p>
                            </div>
                          </div>
                        </>

                      </div>
                    </div>
                  </li> :
                    <></>
                  }
                  {loading ? <li>
                    <div className="relative pb-8">
                      {/* {key !== messageHistory.length - 1 ? (
                                         <span className="absolute left-5 top-5 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                                       ) : null} */}
                      <div className="relative flex items-start space-x-3">

                        <>
                          <div className="relative">
                            {/* <img
                                                 className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-400 ring-8 ring-white"
                                                 src={activityItem.imageUrl}
                                                 alt=""
                                               /> */}
                            {/*     
                                               <span className="absolute -bottom-0.5 -right-1 rounded-tl bg-white px-0.5 py-px">
                                                 <ChatBubbleLeftEllipsisIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                                               </span> */}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div>
                              <div className="text-sm">
                                <a href='#' className="font-medium text-gray-900">
                                  AI
                                </a>
                              </div>
                              {/* <p className="mt-0.5 text-sm text-gray-500">Commented Now</p> */}
                            </div>
                            <div className="mt-2 text-sm text-gray-700">
                              <p>... AI is typing</p>
                            </div>
                          </div>
                        </>

                      </div>
                    </div>
                  </li> :
                    <></>
                  }
                  <div ref={endOfMessagesRef} />
                </ul>
              </div>
              {/* end content  */}
              {/* form */}
              <form onSubmit={clickHandler}>
                <div className="flex items-start space-x-4 content">
                  <div className="min-w-0 flex-1">
                    <div className="relative">
                      <div className="overflow-hidden rounded-lg shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-zoodealioblue">
                        <label htmlFor="comment" className="sr-only">
                          Add your comment
                        </label>
                        {loading ?
                          <input
                            name="comment"
                            id="comment"
                            className="input content block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Add your comment..."
                            onChange={handleInput}
                            value={userInput}
                            disabled
                          />
                          :
                          <input
                            name="comment"
                            id="comment"
                            className="input content block w-full resize-none border-0 bg-transparent py-1.5 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                            placeholder="Add your comment..."
                            value={userInput}
                            onChange={handleInput}

                          />}

                        {/* Spacer element to match the height of the toolbar */}
                        <div className="py-2" aria-hidden="true">
                          {/* Matches height of button in toolbar (1px border + 36px content height) */}
                          <div className="py-px">
                            <div className="h-9" />
                          </div>
                        </div>
                      </div>

                      <div className="absolute inset-x-0 bottom-0 flex justify-between py-2 pl-3 pr-2">
                        <div className="flex items-center space-x-5">
                          <div className="flex items-center">
                            <button
                              type="button"
                              className="-m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500"
                            >
                              <PaperClipIcon className="h-5 w-5" aria-hidden="true" />
                              <span className="sr-only">Attach a file</span>
                            </button>
                          </div>
                          <div className="flex items-center">
                            <Listbox value={selected} onChange={setSelected}>
                              {({ open }) => (
                                <>
                                  <Listbox.Label className="sr-only">Your mood</Listbox.Label>
                                  <div className="relative">
                                    <Listbox.Button className="relative -m-2.5 flex h-10 w-10 items-center justify-center rounded-full text-gray-400 hover:text-gray-500">
                                      <span className="flex items-center justify-center">
                                        {selected.value === null ? (
                                          <span>
                                            <FaceSmileIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                                            <span className="sr-only">Add your mood</span>
                                          </span>
                                        ) : (
                                          <span>
                                            <span
                                              className={classNames(
                                                selected.bgColor,
                                                'flex h-8 w-8 items-center justify-center rounded-full'
                                              )}
                                            >
                                              <selected.icon className="h-5 w-5 flex-shrink-0 text-white" aria-hidden="true" />
                                            </span>
                                            <span className="sr-only">{selected.name}</span>
                                          </span>
                                        )}
                                      </span>
                                    </Listbox.Button>

                                    <Transition
                                      show={open}
                                      as={Fragment}
                                      leave="transition ease-in duration-100"
                                      leaveFrom="opacity-100"
                                      leaveTo="opacity-0"
                                    >
                                      <Listbox.Options className="absolute z-10 -ml-6 mt-1 w-60 rounded-lg bg-white py-3 text-base shadow ring-1 ring-black ring-opacity-5 focus:outline-none sm:ml-auto sm:w-64 sm:text-sm">
                                        {moods.map((mood) => (
                                          <Listbox.Option
                                            key={mood.value}
                                            className={({ active }) =>
                                              classNames(
                                                active ? 'bg-gray-100' : 'bg-white',
                                                'relative cursor-default select-none px-3 py-2'
                                              )
                                            }
                                            value={mood}
                                          >
                                            <div className="flex items-center">
                                              <div
                                                className={classNames(
                                                  mood.bgColor,
                                                  'flex h-8 w-8 items-center justify-center rounded-full'
                                                )}
                                              >
                                                <mood.icon
                                                  className={classNames(mood.iconColor, 'h-5 w-5 flex-shrink-0')}
                                                  aria-hidden="true"
                                                />
                                              </div>
                                              <span className="ml-3 block truncate font-medium">{mood.name}</span>
                                            </div>
                                          </Listbox.Option>
                                        ))}
                                      </Listbox.Options>
                                    </Transition>
                                  </div>
                                </>
                              )}
                            </Listbox>
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <button
                            onClick={clickHandler}
                            className="inline-flex items-center rounded-md bg-zoodealioblue px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-zoodealioblue focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                          >
                            Post
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
                <input type="submit" className="hide" />
              </form>
              {/* end form */}

            </div>
          </main>
        </div>
      </div>
    </>
  )
}
