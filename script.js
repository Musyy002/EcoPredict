const API_KEY = "YOUR_API_KEY";

async function analyzeFood() {

    const ingredients =
        document.getElementById("ingredients").value.trim();

    if (!ingredients) {
        alert("Please enter ingredients.");
        return;
    }

    document.getElementById("loader")
        .classList.remove("hidden");

    document.getElementById("results")
        .classList.add("hidden");

    const prompt = `
You are a food waste reduction expert.

The user has these ingredients:

${ingredients}

Provide your response in EXACTLY this format:

RECIPES:
- recipe 1
- recipe 2
- recipe 3

STORAGE:
- storage tip 1
- storage tip 2
- storage tip 3

RISK:
- spoilage analysis
- ingredients likely to expire first

SUSTAINABILITY:
- sustainability tip 1
- sustainability tip 2
- sustainability tip 3
`;

    try {

        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();

        const text =
            data.candidates[0].content.parts[0].text;

        parseResponse(text);

    } catch(error) {

        console.error(error);

        alert("Error connecting to Gemini API.");

    }

    document.getElementById("loader")
        .classList.add("hidden");
}

function parseResponse(text){

    let recipes = "";
    let storage = "";
    let risk = "";
    let sustainability = "";

    const recipeMatch =
        text.match(/RECIPES:(.*?)STORAGE:/s);

    const storageMatch =
        text.match(/STORAGE:(.*?)RISK:/s);

    const riskMatch =
        text.match(/RISK:(.*?)SUSTAINABILITY:/s);

    const sustainabilityMatch =
        text.match(/SUSTAINABILITY:(.*)/s);

    if(recipeMatch)
        recipes = recipeMatch[1];

    if(storageMatch)
        storage = storageMatch[1];

    if(riskMatch)
        risk = riskMatch[1];

    if(sustainabilityMatch)
        sustainability = sustainabilityMatch[1];

    document.getElementById("recipes")
        .innerText = recipes;

    document.getElementById("storage")
        .innerText = storage;

    document.getElementById("risk")
        .innerText = risk;

    document.getElementById("sustainability")
        .innerText = sustainability;

    document.getElementById("results")
        .classList.remove("hidden");
}