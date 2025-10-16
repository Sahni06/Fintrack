<div align="center"> <img src="public/logo.png" alt="Fintrack Logo" width="150"/> </div> <p align="center"> <strong>A modern, AI-driven platform to help you track expenses, manage budgets, and gain intelligent insights into your financial health.</strong> </p> <p align="center"> <a href="https://fintrack-dusky.vercel.app/"><strong>View Live Demo »</strong></a> </p> <p align="center"> <img src="https://img.shields.io/github/stars/Sahni06/Fintrack?style=social" alt="GitHub Stars"/> <img src="https://img.shields.io/github/forks/Sahni06/Fintrack?style=social" alt="GitHub Forks"/> <img src="https://img.shields.io/github/last-commit/Sahni06/Fintrack" alt="Last Commit"/> </p>

<b>About The Project</b><br>
Fintrack is a full-stack web application designed to simplify personal finance management. In today's complex financial landscape, keeping track of where your money goes can be a challenge. Fintrack leverages the power of AI to not only track your income and expenses but also to provide predictive insights and personalised recommendations.
<br>

This project was built to explore modern web technologies and apply them to a real-world problem, offering users a clean, intuitive, and powerful tool for financial clarity.

<b>Key Features:</b> <br>
<ul>
<li><b>Dashboard:</b> An at-a-glance overview of your financial status, including current balance, recent transactions, and spending summaries.
<img width="860" height="350" alt="image" src="https://github.com/user-attachments/assets/c9ccc665-a5c9-4878-b552-3e5f75e7a7bb" />
</li>
<li><b>AI-Powered Insights:</b> Get smart suggestions, spending pattern analysis, and future financial projections powered by AI.
<img width="300" height="350" alt="image" src="https://github.com/user-attachments/assets/727888c9-a74f-4b60-b0cd-daf4570f962f" />
<img width="300" height="350" alt="image" src="https://github.com/user-attachments/assets/488205d4-d422-4e20-89ba-f88985a9deae" />
<img width="300" height="350" alt="image" src="https://github.com/user-attachments/assets/865fe411-f241-4b1d-912c-dd4e97369b32" />
</li>


<li><b>Transaction Management: </b>Easily add, categorize, and view all your financial transactions. <br>
<img width="300" height="600" alt="fullsizesccoftransaction_create" src="https://github.com/user-attachments/assets/97a025a0-9704-44b7-95b9-653c9c4e914f" />
<img width="620" height="341" alt="image" src="https://github.com/user-attachments/assets/ca0b3a0a-14ba-43bd-bd0e-702f9b5a146a" />
</li>

<li><b>Secure Authentication:</b> User accounts are protected with secure login and registration powered by Clerk.<br>
<img width="218" height="262" alt="image" src="https://github.com/user-attachments/assets/851f43b0-484f-471f-9b00-72f58e9ffbb4" />
</li>

<li><b>Interactive Charts:</b> Visualize your financial data with beautiful, interactive charts to better understand your spending habits.<br>
<img width="224" height="318" alt="image" src="https://github.com/user-attachments/assets/40ab4d98-dea3-4bca-aa65-c808680cac78" /></li>
</ul>

<b>Built With</b> <br>
This project utilises a modern, full-stack JavaScript tech stack:
<ul>
 <li>Next.js </li>
<li>React</li>
<li>Tailwind CSS</li>
<li>Prisma</li>
<li>Clerk</li>
<li>PostgreSQL</li>
<li>Vercel</li>
</ul>

<b>Getting Started</b><br>
To get a local copy up and running, follow these simple steps.<br>

<b>Prerequisites</b><br>
You need to have Node.js (v18 or newer) and npm installed on your machine.

<li>npm

npm install npm@latest -g </li><br>
<b>Installation</b> <br>
<ol>
  <li>Fork the repository to your own GitHub account.</li>

<li>Clone the repository:</li>

git clone https://github.com/your-username/Fintrack.git
cd Fintrack

<li>Install NPM packages:</li>
npm install
<li>Set up your environment variables:</li>
<ul>
<li>Create a .env.local file in the root of your project.</li>
<li>Add the necessary environment variables. You will need keys for your database and Clerk authentication.<br></li>

DATABASE_URL="postgresql://user:password@host:port/database"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_..."
CLERK_SECRET_KEY="sk_..."
</ul>
<li>Set up the Prisma database:</li>
<ul>
<li>Run the Prisma migration to set up your database schema.<br></li>
</ul>
npx prisma migrate dev
</ol>
<b>Running the Application</b> <br>

Now, you can run the development server:<br>

-npm run dev <br>

Open <b> http://localhost:3000</b> with your browser to see the result.

<b>Contributing</b><br>
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.<br>

If you have a suggestion that would make this better, please fork the repo and create a pull request. You can also simply open an issue with the tag "enhancement".
<ol>
<li>Fork the Project</li>

<li>Create your Feature Branch (git checkout -b feature/AmazingFeature)</li>

<li>Commit your Changes (git commit -m 'Add some AmazingFeature')</li>

<li>Push to the Branch (git push origin feature/AmazingFeature)</li>

<li>Open a Pull Request</li>
</ol>
Project Link:https://fintrack-dusky.vercel.app/
