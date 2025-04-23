
export function mapToBullPriority(priority: number): number {
  switch (priority) {
    case 1: return 1;    // Highest priority - critical emails
    case 2: return 2;
    case 3: return 3;
    case 4: return 4;
    case 5: return 5;
    default: return 3;
  }
}

// Get priority label for logging
export function getPriorityLabel(priority: number): string {
  switch (priority) {
    case 1: return "CRITICAL";
    case 2: return "HIGH PRIORITY";
    case 3: return "NORMAL";
    case 4: return "LOW PRIORITY";
    case 5: return "BULK";
    default: return "NORMAL";
  }
}

export function getProcessingTimeByPriority(priority: number): number {
  switch (priority) {
    case 1: return 500;  // Critical emails process fastest
    case 2: return 1000;
    case 3: return 1500;
    case 4: return 2000;
    case 5: return 3000; // Bulk emails process slowest
    default: return 1500;
  }
}