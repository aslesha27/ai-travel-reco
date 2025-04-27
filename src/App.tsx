import { FormEvent, useState } from "react";
import { Loader, Placeholder } from "@aws-amplify/ui-react";
import "./App.css";
import { Amplify } from "aws-amplify";
import { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";
import outputs from "../amplify_outputs.json";

import "@aws-amplify/ui-react/styles.css";

Amplify.configure(outputs)

const amplifyClient = generateClient<Schema>({
    authMode: "apiKey",
});

function App () {
    const [result, setResult] = useState<string>("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setLoading(true);

        try {
            const formData = new FormData(event.currentTarget);
            const interestsRaw = formData.get("interests")?.toString() || "";

    // Split the interests by commas and trim spaces
    const interestsArray = interestsRaw
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0); // removes empty strings

    console.log("Submitting interests:", interestsArray);
            const { data, errors } = await amplifyClient.queries.askBedrock({
                interests: interestsArray,
            });

            if (!errors) {
                setResult(data?.body || "No data returned");
            } else {
                console.log(errors);
            }

            } catch (e) {
                alert(`An error occurred: ${e}`);
            } finally {
            setLoading(false);
        }
    }

    return (
        <div className="app-container">
            <div className="header-container">
                <h1 className="main-header">Meet Your Personal
                    <span className="highlight"> Travel Reco </span>
                </h1>
                <p className="description">
                    Simply type a few interests using the format interest1, interest2, etc...
                    and the generator will comeback with great destination recommendations for you.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="form-container">
                <div className="search-container">
                    <input
                        type="text"
                        className="wide-input"
                        id="interests"
                        name="interests"
                        placeholder="interest1, interest2, interest3,...etc"
                    />
                    <button type="submit" className="search-button">
                        Submit
                    </button>
                </div>
            </form>

            <div className="result-container">
                {loading ? (
                    <div className="loader-container">
                        <p>Loading...</p>
                        <Loader size="large"/>
                        <Placeholder size="large"/>
                        <Placeholder size="large"/>
                        <Placeholder size="large"/>
                    </div>
                ) : (
                    result && <p className="result">{result}</p>
                )}
            </div>
        </div>
    )
}

export default App