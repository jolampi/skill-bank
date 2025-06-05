"use client";

import withAuthentication from "@/components/withAuthentication";
import Navigation from "@/components/Navigation";

const Home: React.FC = () => {
  return (
    <div>
      <header>
        <Navigation />
      </header>
      <main>
        <h1>Welcome!</h1>
      </main>
    </div>
  );
};

export default withAuthentication(Home);
