import { api } from "~/utils/api";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const useAddNewEventGuest = (eventId: string) => {
  const router = useRouter();
  const { mutate: addNewEventGuest } = api.events.addNewGuest.useMutation({
    onSuccess: async () => {
      await router.push(`/event/feed/${eventId}`);
    },
    onError: () => {
      toast.error("Sorry, this password is invalid.");
    },
  });
  return addNewEventGuest;
};
