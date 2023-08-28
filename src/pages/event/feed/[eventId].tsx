import { api } from "~/utils/api";

const Page = () => {
  const { data } = api.posts.getAllForEvent.useQuery();

  return <div>Page</div>;
};

export default Page;
