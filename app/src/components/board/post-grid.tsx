import { Reveal } from "./reveal";
import { PostCard } from "./post-card";
import type { PostRow } from "@/lib/types";

export function PostGrid({
  posts,
  profile,
}: {
  posts: PostRow[];
  profile: "celebratory" | "warm" | "solemn";
}) {
  return (
    <div className="mx-auto max-w-5xl columns-1 gap-5 px-6 pb-24 sm:columns-2 lg:columns-3">
      {posts.map((post, i) => (
        <div key={post.id} className="mb-5">
          <Reveal profile={profile} inView delay={Math.min(i % 6, 5) * 0.06}>
            <PostCard post={post} />
          </Reveal>
        </div>
      ))}
    </div>
  );
}
