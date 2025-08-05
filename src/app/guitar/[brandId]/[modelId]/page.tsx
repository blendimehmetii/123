"use client";

import { useParams } from "next/navigation";
import { useQuery, gql } from "@apollo/client";
import { useState } from "react";

const GET_MODEL_DETAILS = gql`
  query GetModelDetails($brandId: ID!, $modelId: ID!) {
    findUniqueModel(brandId: $brandId, modelId: $modelId) {
      id
      name
      type
      image
      description
      price
      specs {
        bodyWood
        neckWood
        fingerboardWood
        pickups
        tuners
        scaleLength
        bridge
      }
      musicians {
        name
        musicianImage
        bands
      }
    }
  }
`;

export default function GuitarDetailsPage() {
  const { brandId, modelId } = useParams();

  const { loading, error, data } = useQuery(GET_MODEL_DETAILS, {
    variables: { brandId, modelId },
  });

  const [tab, setTab] = useState<"specs" | "musicians">("specs");
  const [musiciansVisible, setMusiciansVisible] = useState(2);

  if (loading) return <p>Loading guitar details...</p>;
  if (error) return <p>Error loading details: {error.message}</p>;
  if (!data?.findUniqueModel) return <p>Guitar not found.</p>;

  const guitar = data.findUniqueModel;
  const musicians = guitar.musicians || [];

  const showMoreMusicians = () => {
    setMusiciansVisible((prev) => Math.min(prev + 2, musicians.length));
  };

  return (
    <div>
      <h1>{guitar.name}</h1>
      <img src={guitar.image} alt={guitar.name} style={{ maxWidth: "300px" }} />
      <p>{guitar.description}</p>
      <p>Price: ${guitar.price}</p>

      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => setTab("specs")}
          style={{
            fontWeight: tab === "specs" ? "bold" : "normal",
            marginRight: 10,
          }}
        >
          Specs
        </button>
        <button
          onClick={() => setTab("musicians")}
          style={{ fontWeight: tab === "musicians" ? "bold" : "normal" }}
        >
          Musicians
        </button>
      </div>

      {tab === "specs" && (
        <div style={{ marginTop: 15 }}>
          <ul>
            <li>Body Wood: {guitar.specs.bodyWood}</li>
            <li>Neck Wood: {guitar.specs.neckWood}</li>
            <li>Fingerboard Wood: {guitar.specs.fingerboardWood}</li>
            <li>Pickups: {guitar.specs.pickups}</li>
            <li>Tuners: {guitar.specs.tuners}</li>
            <li>Scale Length: {guitar.specs.scaleLength}</li>
            <li>Bridge: {guitar.specs.bridge}</li>
          </ul>
        </div>
      )}

      {tab === "musicians" && (
        <div style={{ marginTop: 15 }}>
          {musicians.length === 0 && <p>No musicians found.</p>}
          <ul>
            {musicians.slice(0, musiciansVisible).map((musician: any, idx: number) => (
              <li key={idx} style={{ marginBottom: 10 }}>
                <img
                  src={musician.musicianImage}
                  alt={musician.name}
                  style={{ width: 50, height: 50, borderRadius: "50%", marginRight: 10 }}
                />
                <strong>{musician.name}</strong> - Bands: {musician.bands.join(", ")}
              </li>
            ))}
          </ul>
          {musiciansVisible < musicians.length && (
            <button onClick={showMoreMusicians}>Show More</button>
          )}
        </div>
      )}
    </div>
  );
}
