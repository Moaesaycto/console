import { Command } from "../components/console/types";

export const buildComputerCommand: Command = {
    name: "buildcomputer",
    description: "Build a custom computer by selecting components step-by-step.",
    usage: "buildcomputer <processor> <gpu> <memory> <storage> <psu>",
    parseParams: (args) => {
      if (args.length < 5) return null;
  
      const [processor, gpu, memory, storage, psu] = args;
  
      // Validation logic for each argument
      const validProcessors = ["Intel_i5", "Intel_i7", "Ryzen_5", "Ryzen_7"];
      const validGPUs = [
        "NVIDIA_RTX_3060",
        "NVIDIA_RTX_3070",
        "AMD_RX_6700",
        "AMD_RX_6800",
      ];
      const validMemory = ["8GB", "16GB", "32GB"];
      const validStorage = ["256GB_SSD", "512GB_SSD", "1TB_SSD", "2TB_HDD"];
      const validPSU = ["500W", "650W", "750W"];
  
      if (
        !validProcessors.includes(processor) ||
        !validGPUs.includes(gpu) ||
        !validMemory.includes(memory) ||
        !validStorage.includes(storage) ||
        !validPSU.includes(psu)
      ) {
        return null;
      }
  
      return { processor, gpu, memory, storage, psu };
    },
    run: (_, params) => {
      const { processor, gpu, memory, storage, psu } = params;
  
      const status = `
      Build Summary:
      Processor: ${processor.replace(/_/g, " ")}
      Graphics Card: ${gpu.replace(/_/g, " ")}
      Memory: ${memory}
      Storage: ${storage.replace(/_/g, " ")}
      Power Supply: ${psu}
      `;
      return {
        completed: true,
        status,
      };
    },
    autoComplete: (args) => {
      const validProcessors = ["Intel_i5", "Intel_i7", "Ryzen_5", "Ryzen_7"];
      const validGPUs = [
        "NVIDIA_RTX_3060",
        "NVIDIA_RTX_3070",
        "AMD_RX_6700",
        "AMD_RX_6800",
      ];
      const validMemory = ["8GB", "16GB", "32GB"];
      const validStorage = ["256GB_SSD", "512GB_SSD", "1TB_SSD", "2TB_HDD"];
      const validPSU = ["500W", "650W", "750W"];
  
      // Determine which argument to suggest based on how many are already provided
      if (args.length === 0) {
        return validProcessors;
      } else if (args.length === 1) {
        return validGPUs.filter((g) => g.toLowerCase().startsWith(args[1]?.toLowerCase() || ""));
      } else if (args.length === 2) {
        return validMemory.filter((m) => m.toLowerCase().startsWith(args[2]?.toLowerCase() || ""));
      } else if (args.length === 3) {
        return validStorage.filter((s) => s.toLowerCase().startsWith(args[3]?.toLowerCase() || ""));
      } else if (args.length === 4) {
        return validPSU.filter((p) => p.toLowerCase().startsWith(args[4]?.toLowerCase() || ""));
      }
  
      // No more suggestions after all arguments are provided
      return [];
    },
  };
  