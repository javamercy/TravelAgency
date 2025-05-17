import { ID, OAuthProvider, Query } from "appwrite";
import { account, appwriteConfig, database } from "./client";

export async function loginWithGoogle() {
  try {
    account.createOAuth2Session(OAuthProvider.Google);
  } catch (error) {
    console.error("Error during Google login:", error);
  }
}
export async function logout() {
  try {
    await account.deleteSession("current");
    return true;
  } catch (error) {
    console.error(error);
  }
}
export async function getGooglePicture() {
  try {
    const session = await account.getSession("current");
    const oAuthToken = session.providerAccessToken;

    if (!oAuthToken) {
      throw new Error("No OAuth token found");
      return null;
    }

    const response = await fetch(
      `https://www.googleapis.com/v1/people/me?personFields=photos`,
      {
        headers: {
          Authorization: `Bearer ${oAuthToken}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Failed to fetch Google profile");
    }

    const data = await response.json();

    const photoUrl =
      data.photos && data.photos.length > 0 ? data.photos[0].url : null;

    return photoUrl;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function addUser() {
  try {
    const user = await account.get();
    if (!user) {
      throw new Error("User not found");
    }
    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("id", user.$id)]
    );

    if (documents.length > 0) {
      console.log("User already exists in the database");
      return;
    }

    const imageUrl = await getGooglePicture();

    const newUser = {
      id: user.$id,
      firstName: user.name.split(" ")[0],
      lastName: user.name.split(" ")[-1],
      email: user.email,
      imageUrl: imageUrl,
      createdDate: new Date().toLocaleString(),
    };

    await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      ID.unique(),
      newUser
    );

    return newUser;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getExistingUser() {
  try {
    const user = await account.get();
    if (!user) return null;

    const { documents } = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.usersCollectionId,
      [Query.equal("id", user.$id)]
    );

    if (documents.length > 0) {
      return documents[0];
    } else {
      return null;
    }
  } catch (error) {
    console.error(error);
    return null;
  }
}
