'use client';
import { useEffect } from 'react';
import Head from 'next/head';

const HomePage = () => {
  useEffect(() => {
    const toggleButton = document.getElementById('mobile-menu-toggle');
    const menu = document.getElementById('navbar-sticky');
    const menuOpenIcon = document.getElementById('menu-open-icon');
    const menuCloseIcon = document.getElementById('menu-close-icon');

    const handleToggle = () => {
      menu?.classList.toggle('hidden');
      menuOpenIcon?.classList.toggle('hidden');
      menuCloseIcon?.classList.toggle('hidden');
    };

    toggleButton?.addEventListener('click', handleToggle);

    return () => {
      toggleButton?.removeEventListener('click', handleToggle);
    };
  }, []);

  return (
    <>
      

      {/* Navbar */}
      <nav className="bg-black dark:bg-gray-900 fixed w-full z-20 top-0 start-0">
        <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
          <a href="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <img src="https://flowbite.com/docs/images/logo.svg" className="h-8" alt="Flowbite Logo" />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              VidPlus
            </span>
          </a>
          <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
            <div className="inline-flex items-center ml-5 space-x-6 lg:justify-end">
              <a
                href="/login"
                className="text-base font-medium leading-6 text-gray-600 whitespace-no-wrap transition duration-150 ease-in-out hover:text-gray-900"
              >
                Login
              </a>
              <a
                href="/register"
                className="inline-flex items-center justify-center px-4 py-1 text-base font-medium leading-6 text-white whitespace-no-wrap bg-indigo-600 border border-transparent rounded-2xl shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600"
              >
                Start Free
              </a>
            </div>
            {/* Hamburger Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-controls="navbar-sticky"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                id="menu-open-icon"
                className="w-5 h-5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 17 14"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M1 1h15M1 7h15M1 13h15"
                />
              </svg>
              {/* Close Icon */}
              <svg
                id="menu-close-icon"
                className="w-5 h-5 hidden"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div
            className="items-center justify-center hidden w-full md:flex md:w-auto md:order-1"
            id="navbar-sticky"
          >
            <ul className="flex flex-col p-4 md:p-0 mt-4 font-medium md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 text-center">
              <li>
                <a href="#" className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900">
                  Home
                </a>
              </li>
              <li>
                <a
                  href="#features"
                  className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900"
                >
                  Features
                </a>
              </li>
              <li>
                <a
                  href="#pricing"
                  className="mr-5 font-medium leading-6 text-gray-600 hover:text-gray-900"
                >
                  Pricing
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Hero Section */}
      <section id="main-hero" className="w-full px-8 py-10 mt-20 bg-black text-white">
        <div className="container mx-auto text-center">
          <h1 className="text-center text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
            <span className="block lg:flex justify-center lg:space-x-2 lg:whitespace-nowrap text-center">
              <span>Get Viral Short Videos</span>
              <span className="block text-indigo-600">in a matter of seconds</span>
            </span>
          </h1>
          <h2 className="m-2 text-xl font-semibold leading-tight text-gray-900 border-0 border-gray-300 lg:text-3xl md:text-2xl">
            for reels, tiktoks, shorts
          </h2>
        </div>
      </section>

      {/* Unique Videos Section */}
      <section id="unique-videos" className="w-full py-1 bg-black text-white">
    <div className="">
        <div className="w-full video-gallery-container">
            <div className="video-gallery m-10">
                <video src="https://storage.googleapis.com/video_rendering/temp/9ed1ce0d-5ee5-4147-abd6-47c3cf16a8b5-main.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/7e1d0a03-652a-47a1-a7bc-636941a8ea38/b8c09b07-53f0-49ff-ba1c-5279a1c82c81-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/temp/4fdb5771-19f5-4c67-bb42-2964fc4eaf0c-main.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/671edf9e-19d4-4092-b980-afaf8de57dd9/d68aa522-5bf2-4bff-bdfc-e7c88165db25-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/3c7b690d-73e9-4cdd-acde-6c5060e2ca5a/e3208ea9-10e0-4086-83d8-6a6eba26c0e8-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/lqkzompfhq8.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/y6ccmo66yp.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/scary.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/motivational.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/temp/9ed1ce0d-5ee5-4147-abd6-47c3cf16a8b5-main.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/7e1d0a03-652a-47a1-a7bc-636941a8ea38/b8c09b07-53f0-49ff-ba1c-5279a1c82c81-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/temp/4fdb5771-19f5-4c67-bb42-2964fc4eaf0c-main.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/671edf9e-19d4-4092-b980-afaf8de57dd9/d68aa522-5bf2-4bff-bdfc-e7c88165db25-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://storage.googleapis.com/video_rendering/3c7b690d-73e9-4cdd-acde-6c5060e2ca5a/e3208ea9-10e0-4086-83d8-6a6eba26c0e8-final.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/lqkzompfhq8.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/y6ccmo66yp.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/scary.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
                <video src="https://video-cdn.autoshorts.ai/demos/motivational.mp4" playsInline autoPlay loop muted className="video-item rounded-lg" loading="lazy"></video>
              </div>
        </div>
        
    </div>



</section>

      {/* Features Section */}
      <section id="features" className="px-2 py-32 md:px-0">
        <div className="container items-center max-w-6xl px-8 mx-auto xl:px-5">
          <div className="flex flex-wrap items-center sm:-mx-3">
            <div className="w-full md:w-1/2 md:px-3">
              <div className="w-full pb-6 space-y-6 sm:max-w-md lg:max-w-lg md:space-y-4 lg:space-y-8 xl:space-y-9 sm:pr-5 lg:pr-0 md:pb-0">
                <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-4xl lg:text-5xl xl:text-6xl">
                  <span className="block xl:inline">Get Viral Short Videos</span>
                  <span className="block text-indigo-600 xl:inline">in matter of seconds</span>
                </h1>
                <p className="mx-auto text-base text-gray-500 sm:max-w-md lg:text-xl md:max-w-3xl">
                  It's never been easier to get viral short videos in matter of seconds
                </p>
                <div className="relative flex flex-col sm:flex-row sm:space-x-4">
                  <a
                    href="#"
                    className="flex items-center w-full px-6 py-3 mb-3 text-lg text-white bg-indigo-600 rounded-md sm:mb-0 hover:bg-indigo-700 sm:w-auto"
                  >
                    Try It Free
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-5 h-5 ml-1"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <line x1="5" y1="12" x2="19" y2="12"></line>
                      <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                  </a>
                  <a
                    href="#"
                    className="flex items-center px-6 py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600"
                  >
                    Learn More
                  </a>
                </div>
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <div className="w-full h-auto overflow-hidden rounded-md shadow-xl sm:rounded-xl bg-gray-50">
                <iframe
                  src="https://www.youtube.com/embed/jNPglNNlw88?si=QFIIO8SqTPu1TuY0"
                  className="fit-video"
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boost Productivity Section */}
      <section id="boost-productivity" className="w-full bg-white pt-7 pb-7 md:pt-20 md:pb-24">
        <div className="box-border flex flex-col items-center content-center px-8 mx-auto leading-6 text-black border-0 border-gray-300 border-solid md:flex-row max-w-7xl lg:px-16">
          {/* Image */}
          <div className="box-border relative w-full max-w-md px-4 mt-5 mb-4 -ml-5 text-center bg-no-repeat bg-contain border-solid md:ml-0 md:mt-0 md:max-w-none lg:mb-0 md:w-1/2 xl:pl-10">
            <img src="https://cdn.devdojo.com/images/december2020/productivity.png" className="p-2 pl-6 pr-5 xl:pl-16 xl:pr-20 " />
          </div>
          {/* Content */}
          <div className="box-border order-first w-full text-black border-solid md:w-1/2 md:pl-10 md:order-none">
            <h2 className="m-0 text-xl font-semibold leading-tight text-gray-900 border-0 border-gray-300 lg:text-3xl md:text-2xl">
              Boost Productivity
            </h2>
            <p className="pt-4 pb-8 m-0 leading-7 text-gray-700 border-0 border-gray-300 sm:pr-12 xl:pr-32 lg:text-lg">
              Build an atmosphere that creates productivity in your organization and your company culture.
            </p>
            <ul className="p-0 m-0 leading-6 border-0 border-gray-300">
              <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-yellow-300 rounded-full">
                  <span className="text-sm font-bold">✓</span>
                </span> Maximize productivity and growth
              </li>
              <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-yellow-300 rounded-full">
                  <span className="text-sm font-bold">✓</span>
                </span> Speed past your competition
              </li>
              <li className="box-border relative py-1 pl-0 text-left text-gray-500 border-solid">
                <span className="inline-flex items-center justify-center w-6 h-6 mr-2 text-white bg-yellow-300 rounded-full">
                  <span className="text-sm font-bold">✓</span>
                </span> Learn the top techniques
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section id="tools" className="py-20 bg-gray-50">
        <div className="container items-center max-w-6xl px-10 mx-auto sm:px-20 md:px-32 lg:px-16">
          <div className="flex flex-wrap items-center -mx-3">
            <div className="order-1 w-full px-3 lg:w-1/2 lg:order-0">
              <div className="w-full lg:max-w-md">
                <h2 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-gray-900 sm:text-4xl font-heading">
                  Jam-packed with all the tools you need to succeed!
                </h2>
                <p className="mb-4 font-medium tracking-tight text-gray-400 xl:mb-6">
                  It's never been easier to build a business of your own. Our tools will help you with the following:
                </p>
                <ul>
                  <li className="flex items-center py-2 space-x-4 xl:py-3">
                    <svg
                      className="w-8 h-8 text-pink-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
                      ></path>
                    </svg>
                    <span className="font-medium text-gray-500">Faster Processing and Delivery</span>
                  </li>
                  <li className="flex items-center py-2 space-x-4 xl:py-3">
                    <svg
                      className="w-8 h-8 text-yellow-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10l-8 4"
                      ></path>
                    </svg>
                    <span className="font-medium text-gray-500">Out of the Box Tracking and Monitoring</span>
                  </li>
                  <li className="flex items-center py-2 space-x-4 xl:py-3">
                    <svg
                      className="w-8 h-8 text-green-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      ></path>
                    </svg>
                    <span className="font-medium text-gray-500">100% Protection and Security for Your App</span>
                  </li>
                </ul>
              </div>
            </div>
            <div className="w-full px-3 mb-12 lg:w-1/2 order-0 lg:order-1 lg:mb-0">
              <img className="mx-auto sm:max-w-sm lg:max-w-full" src="https://cdn.devdojo.com/images/november2020/feature-graphic.png" alt="feature image" />
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="box-border py-8 leading-7 text-gray-900 bg-white border-0 border-gray-200 border-solid sm:py-12 md:py-16 lg:py-24">
        <div className="box-border max-w-6xl px-4 pb-12 mx-auto border-solid sm:px-6 md:px-6 lg:px-4">
          <div className="max-w-md mx-auto mb-14 text-center">
            <h1 className="text-4xl font-semibold mb-6 lg:text-5xl"><span className="text-indigo-600">Flexible</span> Plans</h1>
            <p className="text-xl text-gray-500 font-medium">Choose a plan that works best for you and your team.</p>
          </div>
          <div className="flex flex-col justify-between items-center lg:flex-row lg:items-start">
            <div className="w-full flex-1 mt-8 p-8 order-2 bg-white shadow-xl rounded-3xl sm:w-96 lg:w-full lg:order-1 lg:rounded-r-none">
              <div className="mb-7 pb-7 flex items-center border-b border-gray-300">
                <img src="https://res.cloudinary.com/williamsondesign/abstract-1.jpg" alt="" className="rounded-3xl w-20 h-20" />
                <div className="ml-5">
                  <span className="block text-2xl font-semibold">FREE</span>
                  <span><span className="font-medium text-gray-500 text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold">0 </span></span><span className="text-gray-500 font-medium">/ user</span>
                </div>
              </div>
              <ul className="mb-7 font-medium text-gray-500">
                <li className="flex text-lg mb-2">
                  <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                  <span className="ml-3"><span className="text-white">5 video</span> per week</span>
                </li>
                <li className="flex text-lg mb-2">
                  <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                  <span className="ml-3">Flexible <span className="text-black">team meetings</span></span>
                </li>
                <li className="flex text-lg">
                  <img src="https://res.cloudinary.com/williamsondesign/check-grey.svg" />
                  <span className="ml-3"><span className="text-black">5 TB</span> cloud storage</span>
                </li>
              </ul>
              <a href="#/" className="flex justify-center items-center bg-indigo-600 rounded-xl py-5 px-4 text-center text-white text-xl">
                Choose Plan
                <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" className="ml-2" />
              </a>
            </div>
            <div className="w-full flex-1 p-8 order-1 shadow-xl rounded-3xl bg-gray-900 text-gray-400 sm:w-96 lg:w-full lg:order-2 lg:mt-0">
              <div className="mb-8 pb-8 flex items-center border-b border-gray-600">
                <img src="https://res.cloudinary.com/williamsondesign/abstract-2.jpg" alt="" className="rounded-3xl w-20 h-20" />
                <div className="ml-5">
                  <span className="block text-3xl font-semibold text-white">PRO</span>
                  <span><span className="font-medium text-xl align-top">$&thinsp;</span><span className="text-3xl font-bold text-white">24 </span></span><span className="font-medium">/ user</span>
                </div>
              </div>
              <ul className="mb-10 font-medium text-xl">
                <li className="flex mb-6">
                  <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                  <span className="ml-3">All features in <span className="text-white">BASIC</span></span>
                </li>
                <li className="flex mb-6">
                  <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                  <span className="ml-3">Flexible <span className="text-white">call scheduling</span></span>
                </li>
                <li className="flex">
                  <img src="https://res.cloudinary.com/williamsondesign/check-white.svg" />
                  <span className="ml-3"><span className="text-white">15 TB</span> cloud storage</span>
                </li>
              </ul>
              <a href="#/" className="flex justify-center items-center bg-indigo-600 rounded-xl py-6 px-4 text-center text-white text-2xl">
                Choose Plan
                <img src="https://res.cloudinary.com/williamsondesign/arrow-right.svg" className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="bg-white">
        <div className="max-w-screen-xl px-4 py-12 mx-auto space-y-8 overflow-hidden sm:px-6 lg:px-8">
          <nav className="flex flex-wrap justify-center -mx-5 -my-2">
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                About
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                Blog
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                Team
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                Pricing
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                Contact
              </a>
            </div>
            <div className="px-5 py-2">
              <a href="#" className="text-base leading-6 text-gray-500 hover:text-gray-900">
                Terms
              </a>
            </div>
          </nav>
          <div className="flex justify-center mt-8 space-x-6">
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Facebook</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Instagram</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.683-.566 1.15-.748.353-.137.882-.3 1.857-.344 1.023-.047 1.351-.058 3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Twitter</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">GitHub</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <span className="sr-only">Dribbble</span>
              <svg className="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.802a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
          <p className="mt-8 text-base leading-6 text-center text-gray-400">
            2021 SomeCompany, Inc. All rights reserved.
          </p>
        </div>
      </section>

      {/* Custom Styles */}
      <style jsx>{`
        /* Custom CSS styles */
        :global(body) {
          background-color: #000000; /* Dark background */
          color: #cbd5e0; /* Light text color */
          scroll-behavior: smooth; /* Enable smooth scrolling */
        }
        .video-gallery {
          display: flex;
          white-space: nowrap;
          animation: slide 30s linear infinite;
        }
        .video-item {
          display: inline-block;
          width: 200px;
          height: auto;
          margin-right: 20px;
          object-fit: cover;
        }
        @keyframes slide {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .video-gallery:hover {
          animation-play-state: paused;
        }
        .video-gallery-container {
          overflow: hidden;
          position: relative;
        }
        .video-gallery-container::before,
        .video-gallery-container::after {
          content: '';
          position: absolute;
          top: 0;
          bottom: 0;
          width: 200px;
          z-index: 1;
        }
        .video-gallery-container::before {
          left: 0;
          background: linear-gradient(to right, #000000, transparent);
        }
        .video-gallery-container::after {
          right: 0;
          background: linear-gradient(to left, #000000, transparent);
        }
      `}</style>
    </>
  );
};

export default HomePage;
