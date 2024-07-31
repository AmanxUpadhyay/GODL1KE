"use strict";

const axios = require("axios");
const fs = require("fs").promises;

const CROSSREF_API_URL = "https://api.crossref.org/works";

async function fetchORCID(name) {
    try {
        const response = await axios.get(`${CROSSREF_API_URL}?query.author=${encodeURIComponent(name)}`, {
            headers: {
                'Accept': 'application/json'
            }
        });

        const works = response.data.message.items;
        for (let work of works) {
            if (work.author) {
                for (let author of work.author) {
                    if (author.ORCID) {
                        return author.ORCID.split("/").pop();
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error(`Error fetching ORCID for ${name}:`, error.message);
        return null;
    }
}

async function fetchResearcherDetails(orcid) {
    const maxRetries = 3;
    let attempt = 0;
    while (attempt < maxRetries) {
        try {
            const response = await axios.get(`https://pub.orcid.org/v3.0/${orcid}/person`, {
                headers: {
                    'Accept': 'application/json'
                }
            });

            console.log(`Fetched details for ORCID ${orcid}`);
            console.log(response.data);

            const data = response.data;
            const name = `${data?.name?.["given-names"]?.value || ""} ${data?.name?.["family-name"]?.value || ""}`.trim();
            const employments = data?.["activities-summary"]?.employments?.["employment-summary"] || [];
            const affiliation = employments.map(employment => employment?.organization?.name).join(", ");
            const emails = data?.emails?.email || [];
            const email = emails.map(email => email.email).join(", ");

            const details = {
                name,
                affiliation,
                email,
                orcid
            };

            console.log(details); // Print all the details directly
        } catch (error) {
            if (error.response && error.response.status === 500) {
                attempt++;
                console.error(`Attempt ${attempt} failed for ORCID ${orcid}. Retrying...`);
            } else {
                return { orcid, error: error.message };
            }
        }
    }
    return { orcid, error: "Max retries reached. Could not fetch details." };
}

async function readCSV() {
    try {
        const filename = "staff_name.csv";
        const data = await fs.readFile(filename, "utf8");
        const names = data.split("\n").map(line => line.trim()).filter(line => line);

        for (const name of names) {
            const orcid = await fetchORCID(name);
            if (orcid) {
                const details = await fetchResearcherDetails(orcid);
                console.log(details);
            } else {
                console.log({ name, error: "ORCID not found." });
            }
        }
    } catch (error) {
        console.error("Error reading CSV file:", error);
    }
}

readCSV();
