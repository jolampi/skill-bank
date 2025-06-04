"use client";

import withAuthentication from "@/components/withAuthentication";
import Navigation from "@/components/Navigation";

const Home: React.FC = () => {
  return (
    <div>
      <Navigation />
      <main>
        <h1>Welcome!</h1>
      </main>
    </div>
  );
};

export default withAuthentication(Home);
