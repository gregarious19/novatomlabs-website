import DiscoveryExperience from "@/components/experience/DiscoveryExperience";

export default function Home() {
  // Pull the experience up under the fixed navbar for a full-bleed stage.
  return (
    <div className="-mt-24">
      <DiscoveryExperience />
    </div>
  );
}
