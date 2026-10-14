import installDemo from "./demo-block";

// Aggregate installer for standalone Aurora; Blicca loads individual installers.
export default function install(config: any) {
  installDemo(config);
  return config;
}
