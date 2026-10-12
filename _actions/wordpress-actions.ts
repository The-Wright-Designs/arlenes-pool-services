"use server";

import {
  transformGalleryImage,
  transformTeamMemberImage,
} from "@/_lib/utils/image-transformations";

export async function getWordpressDetails() {
  return {
    username: process.env.WORDPRESS_USER,
    password: process.env.WORDPRESS_PASS,
  };
}

export async function fetchGalleryData() {
  const { username, password } = await getWordpressDetails();
  const authToken = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://wordpress.arlenespools.co.za/wp-json/wp/v2/gallery`,
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch gallery data: ${response.status}`);
    }

    const galleryData = await response.json();

    // Log the first image URL to see its structure
    if (
      galleryData.length > 0 &&
      galleryData[0].acf?.photo_gallery?.gallery?.[0] &&
      galleryData[0].acf.photo_gallery.gallery[0].length > 0
    )
      if (
        galleryData.length > 0 &&
        galleryData[0].acf?.photo_gallery?.gallery?.[0]
      ) {
        // Transform gallery image URLs using ImageKit
        galleryData[0].acf.photo_gallery.gallery[0] =
          galleryData[0].acf.photo_gallery.gallery[0].map(
            (image: { full_image_url: string }) => ({
              ...image,
              // Store both original and transformed URLs
              original_image_url: image.full_image_url,
              // Mobile version (square)
              full_image_url: transformGalleryImage(
                image.full_image_url,
                false
              ),
              // Desktop version (landscape)
              desktop_image_url: transformGalleryImage(
                image.full_image_url,
                true
              ),
            })
          );
      }

    return galleryData;
  } catch (error) {
    console.error("Error fetching gallery data:", error);
    return [];
  }
}

export async function fetchStaffData() {
  const { username, password } = await getWordpressDetails();
  const authToken = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(
      "https://wordpress.arlenespools.co.za/wp-json/wp/v2/staff",
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch staff data: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching staff data:", error);
    return [];
  }
}

export async function fetchMediaDetails(imageIds: number[]) {
  if (!imageIds.length) return {};

  const { username, password } = await getWordpressDetails();
  const authToken = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://wordpress.arlenespools.co.za/wp-json/wp/v2/media?include=${imageIds.join(
        ","
      )}&per_page=100`,
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      console.error(
        "Failed to fetch media data:",
        response.status,
        response.statusText
      );
      return {};
    }

    const mediaData = await response.json();

    const imageLookup: Record<number, string> = {};
    mediaData.forEach((media: any) => {
      imageLookup[media.id] =
        media.source_url ||
        media.media_details?.sizes?.full?.source_url ||
        media.media_details?.sizes?.large?.source_url ||
        "";
    });

    return imageLookup;
  } catch (error) {
    console.error("Error fetching media details:", error);
    return {};
  }
}

export async function fetchSingleMediaItem(id: number) {
  const { username, password } = await getWordpressDetails();
  const authToken = Buffer.from(`${username}:${password}`).toString("base64");

  try {
    const response = await fetch(
      `https://wordpress.arlenespools.co.za/wp-json/wp/v2/media/${id}`,
      {
        headers: {
          Authorization: `Basic ${authToken}`,
          "Content-Type": "application/json",
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
        next: {
          revalidate: 300,
        },
      }
    );

    if (!response.ok) {
      console.error(`Failed to fetch image ID ${id}: ${response.status}`);
      return null;
    }

    const mediaItem = await response.json();
    return mediaItem.source_url || "";
  } catch (error) {
    console.error(`Error fetching image ID ${id}:`, error);
    return null;
  }
}

export async function fetchTeamData() {
  try {
    const staffData = await fetchStaffData();
    const staffList = staffData[0]?.acf || {};

    interface StaffMember {
      name: string;
      image: number;
    }

    const staffMembers = Object.values(staffList) as StaffMember[];
    const imageIds = staffMembers.map((member) => member.image).filter(Boolean);

    let imageLookup = await fetchMediaDetails(imageIds);

    // Fallback: fetch individual media items if bulk fetch fails
    if (Object.keys(imageLookup).length === 0) {
      imageLookup = {};
      for (const id of imageIds) {
        const imageUrl = await fetchSingleMediaItem(id);
        if (imageUrl) {
          imageLookup[id] = imageUrl;
          console.log(
            `Successfully fetched image ID ${id}: ${imageLookup[id]}`
          );
        }
      }
    }

    const teamMembers = staffMembers.map((member) => {
      // Get the original image URL
      const originalImageUrl = imageLookup[member.image] || "";

      if (!originalImageUrl) {
        console.log(
          `No image URL found for ${member.name} (ID: ${member.image})`
        );
      }

      // Transform the image URL using ImageKit
      const imageUrl = transformTeamMemberImage(originalImageUrl);

      return {
        name: member.name,
        image: member.image,
        imageUrl,
      };
    });

    return teamMembers;
  } catch (error) {
    console.error("Error in fetchTeamData:", error);
    return [];
  }
}
