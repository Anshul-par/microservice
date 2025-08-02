import buildClient from "../api/build-client";

const LandingPage = ({ data }) => {
  return data ? <h1>You are signed in</h1> : <h1>You are NOT signed in</h1>;
};

LandingPage.getInitialProps = async (context) => {
  console.log("LANDING PAGE!");
  const client = buildClient(context);
  const res = await client.get("/api/auth/current-user");

  console.log("Response Data:", res.data);

  return res.data;
};

export default LandingPage;
