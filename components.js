export const components = {
    hero: `
        <section class="bg-white dark:bg-gray-900">
            <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
                <div class="mr-auto place-self-center lg:col-span-7">
                    <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl text-gray-900">Building digital products made easy</h1>
                    <p class="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl">From checkout to global sales tax compliance, companies around the world use Flowbite to simplify their payment stack.</p>
                    <a href="#" class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-white rounded-lg bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300">
                        Get started
                        <svg class="w-5 h-5 ml-2 -mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                    </a>
                </div>
                <div class="hidden lg:mt-0 lg:col-span-5 lg:flex">
                    <img src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/hero/phone-mockup.png" alt="mockup">
                </div>            
            </div>
        </section>
    `,
    button: `
        <div class="flex flex-col items-center justify-center h-screen gap-4">
            <button class="px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition">Primary Button</button>
            <button class="px-6 py-3 bg-white text-gray-800 border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 transition">Secondary Button</button>
            <button class="px-6 py-3 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition">Destructive</button>
        </div>
    `,
    card: `
        <div class="flex items-center justify-center h-screen bg-gray-100">
            <div class="max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Noteworthy technology acquisitions 2024</h5>
                </a>
                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Here are the biggest enterprise technology acquisitions of 2024 so far, in reverse chronological order.</p>
                <a href="#" class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Read more
                    <svg class="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>
    `,
    navbar: `
        <nav class="bg-white border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800">
            <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
                <a href="#" class="flex items-center">
                    <img src="https://flowbite.com/docs/images/logo.svg" class="mr-3 h-6 sm:h-9" alt="Logo" />
                    <span class="self-center text-xl font-semibold whitespace-nowrap dark:text-white">Brand</span>
                </a>
                <div class="hidden justify-between items-center w-full md:flex md:w-auto md:order-1" id="mobile-menu-2">
                    <ul class="flex flex-col mt-4 font-medium md:flex-row md:space-x-8 md:mt-0">
                        <li><a href="#" class="block py-2 pr-4 pl-3 text-white bg-blue-700 rounded md:bg-transparent md:text-blue-700 md:p-0" aria-current="page">Home</a></li>
                        <li><a href="#" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Company</a></li>
                        <li><a href="#" class="block py-2 pr-4 pl-3 text-gray-700 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-gray-400 md:dark:hover:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Features</a></li>
                    </ul>
                </div>
            </div>
        </nav>
        <div class="p-10 text-center text-gray-500">Content goes here</div>
    `,
    todo: `
        <div class="h-screen bg-gray-100 flex items-center justify-center font-sans">
            <div class="bg-white rounded shadow p-6 m-4 w-full lg:w-3/4 lg:max-w-lg">
                <div class="mb-4">
                    <h1 class="text-grey-darkest">Todo List</h1>
                    <div class="flex mt-4">
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 mr-4 text-grey-darker" placeholder="Add Todo">
                        <button class="flex-no-shrink p-2 border-2 rounded text-teal-500 border-teal-500 hover:text-white hover:bg-teal-500">Add</button>
                    </div>
                </div>
                <div>
                    <div class="flex mb-4 items-center">
                        <p class="w-full text-grey-darkest">Add another component to Vue</p>
                        <button class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-green-500 border-green-500 hover:bg-green-500">Done</button>
                        <button class="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red-500 hover:text-white hover:bg-red-500">Remove</button>
                    </div>
                    <div class="flex mb-4 items-center">
                        <p class="w-full line-through text-green-500">Submit Todo App Component</p>
                        <button class="flex-no-shrink p-2 ml-4 mr-2 border-2 rounded hover:text-white text-grey-500 border-grey-500 hover:bg-grey-500">Not Done</button>
                        <button class="flex-no-shrink p-2 ml-2 border-2 rounded text-red-500 border-red-500 hover:text-white hover:bg-red-500">Remove</button>
                    </div>
                </div>
            </div>
        </div>
    `,
    form: `
        <div class="flex justify-center items-center h-screen bg-gray-50">
            <div class="w-full max-w-xs">
                <form class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                    <div class="mb-4">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="username">Username</label>
                        <input class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" id="username" type="text" placeholder="Username">
                    </div>
                    <div class="mb-6">
                        <label class="block text-gray-700 text-sm font-bold mb-2" for="password">Password</label>
                        <input class="shadow appearance-none border border-red-500 rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline" id="password" type="password" placeholder="******************">
                        <p class="text-red-500 text-xs italic">Please choose a password.</p>
                    </div>
                    <div class="flex items-center justify-between">
                        <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="button">Sign In</button>
                        <a class="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">Forgot Password?</a>
                    </div>
                </form>
            </div>
        </div>
    `,
    default: `
        <div class="flex flex-col items-center justify-center h-screen text-center p-8">
            <h2 class="text-3xl font-bold text-gray-800 mb-4">App Updated</h2>
            <p class="text-gray-600 max-w-md">I've updated the structure based on your request. This is a simulated preview of a generic update.</p>
            <div class="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800">
                Try asking for a "hero", "button", "navbar", "card", or "todo list"!
            </div>
        </div>
    `
};

export const templates = {
    hero: { desc: 'Hero Section', html: components.hero },
    button: { desc: 'Buttons', html: components.button },
    card: { desc: 'Card Component', html: components.card },
    navbar: { desc: 'Navigation Bar', html: components.navbar },
    todo: { desc: 'Todo List App', html: components.todo },
    form: { desc: 'Login Form', html: components.form },
    default: { desc: 'Generic Layout', html: components.default }
};