export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <h1 className="text-4xl font-bold text-primary-800 dark:text-primary-200 mb-6">About Me</h1>
      
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <p className="text-xl text-secondary-700 dark:text-secondary-300 mb-6">
          Welcome to my personal blog! I{'\''}m passionate about technology, design, and sharing knowledge with the community.
        </p>
        
        <p className="mb-6">
          With years of experience in software development, I focus on creating elegant solutions to complex problems. 
          My expertise spans across frontend and backend technologies, with a particular interest in modern JavaScript 
          frameworks and cloud architectures.
        </p>
        
        <h2 className="text-2xl font-semibold text-primary-700 dark:text-primary-300 mt-8 mb-4">What You{'\''}ll Find Here</h2>
        <p className="mb-6">
          This blog covers a wide range of topics including:
        </p>
        <ul className="list-disc pl-6 mb-6 space-y-2">
          <li>Technical tutorials and guides</li>
          <li>Best practices for modern web development</li>
          <li>Insights on design systems and UI/UX</li>
          <li>Reviews of the latest tools and frameworks</li>
          <li>Opinions on industry trends and developments</li>
        </ul>
        
        <h2 className="text-2xl font-semibold text-primary-700 dark:text-primary-300 mt-8 mb-4">Contact</h2>
        <p>
          Have questions or want to connect? Feel free to reach out through the contact page or connect with me on social media.
        </p>
      </div>
    </div>
  );
}