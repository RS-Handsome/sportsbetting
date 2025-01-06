import axios from "axios";
import * as cheerio from 'cheerio';

const query: string = "players list of Estrela Soccer team";

const headers = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
};

export class MyGoogle {
  public get_team_link = async (query: string): Promise<string | null> => {
    const url: string = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
    console.log(url);

    try {
        const response = await axios.get(url, { headers });
        const $ = cheerio.load(response.data);
        const keyword: string = "2024-25 Squad";

        // Iterate through <h3> tags to find the desired link
        let result: string | null = null; // Initialize result as null

        $("h3").each((i, element) => {
            const h3Text: string = $(element).text();
            // Check if the keyword is in the text of the <h3> tag
            if (h3Text.includes(keyword)) {
                // Get the parent <a> tag
                const aTag = $(element).closest("a");
                if (aTag.length) {
                    // Assign href attribute to result
                    result = aTag.attr("href") || null; // Ensure it's not undefined
                    return false; // Break out of each loop once found
                }
            }
        });

        return result; // Return the result after processing all <h3> tags
    } catch (error) {
        console.error("Error fetching data:", error);
        return null; // Return null in case of an error
    }
};
}
