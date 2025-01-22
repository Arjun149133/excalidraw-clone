import db from "./index";

const getUser = async (userId: string) => {
  const user = await db.user.findFirst({
    where: {
      id: userId,
    },
    select: {
      email: true,
    },
  });

  if (!user) {
    return null;
  }

  return user;
};

export { getUser };
