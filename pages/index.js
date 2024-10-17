// pages/index.js
import Head from 'next/head';
import Carousel from '../components/Carousel';
import DarkModeToggle from '../components/DarkModeToggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
      <Head>
        <title>Image Carousel</title>
        <meta name="description" content="Image Carousel with Locking Mechanism" />
      </Head>
      <DarkModeToggle />
      <main className="flex flex-col items-center justify-center py-10">
        <h1 className="text-4xl font-bold mb-8">Image Carousel</h1>
        <Carousel />
      </main>
    </div>
  );
}
