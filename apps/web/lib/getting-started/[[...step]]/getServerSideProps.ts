import type { GetServerSidePropsContext } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";

import { getLocale } from "@calcom/features/auth/lib/getLocale";
import { getServerSession } from "@calcom/features/auth/lib/getServerSession";
import { UserRepository } from "@calcom/lib/server/repository/user";

import { ssrInit } from "@server/lib/ssr";

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const { req } = context;

  const session = await getServerSession({ req });

  if (!session?.user?.id) {
    return { redirect: { permanent: false, destination: "/auth/login" } };
  }

  const ssr = await ssrInit(context);

  await ssr.viewer.me.prefetch();

  const user = await UserRepository.findUserTeams({
    id: session.user.id,
  });

  if (!user) {
    throw new Error("User from session not found");
  }
  // prevent access of onboarding flow after completion.
  // TODO: Not compatible with appDir
  /*if (user.completedOnboarding) {
    return {
      notFound: true,
    };
  }*/

  const locale = await getLocale(context.req);
  return {
    props: {
      ...(await serverSideTranslations(locale || "en", ["common"])),
      trpcState: ssr.dehydrate(),
      memberOf: user.teams.filter((team) => team.accepted === true),
      hasPendingInvites: user.teams.find((team) => team.accepted === false) ?? false,
    },
  };
};
