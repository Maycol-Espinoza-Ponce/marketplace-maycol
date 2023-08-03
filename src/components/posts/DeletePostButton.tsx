import { Component, Show, createSignal } from "solid-js";
import { supabase } from "../../lib/supabaseClient";
import type { AuthSession } from "@supabase/supabase-js";

interface Props {
  // Define the type of the prop
  // (Id, UserId)
  Id: number;
  UserId: string;
}

const { data: User, error: UserError } = await supabase.auth.getSession();

export const DeletePostButton: Component<Props> = (props) => {
  // initialize session
  const [session, setSession] = createSignal<AuthSession | null>(null);

  if (UserError) {
    console.log("User Error: " + UserError.message);
  } else {
    setSession(User.session);
    console.log(User);
  }

  //Pre: User is logged in, there is a click to delete a post
  //Post: The post is deleted from the database
  const deletePost = async (e: SubmitEvent) => {
    e.preventDefault();
    function hello() {
      console.log("hello");
    }

    function checkIfUserIsProvider() {
      if (session()!.user.id === props.UserId) {
        return true;
      } else {
        return false;
      }
    }

    // check if user is provider and if they are the owner of the post
    // if they are, delete the post
    if (props.UserId === session()!.user.id) {
      try {
        const { error } = await supabase
          .from("provider_post")
          .delete()
          .eq("id", props.Id);
        console.log("deleted post", props.Id);
      } catch (error) {
        console.log(error);
      } finally {
        // refresh the page
        window.location.reload();
      }
    } else {
      console.log("You can't delete this post because it is not yours.");
    }
  };

  return (
    <Show when={session()!.user.id === props.UserId}>
      <div>
        <form onSubmit={deletePost}>
          <button
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            type="submit"
          >
            Delete
          </button>
        </form>
      </div>
    </Show>
  );
};
