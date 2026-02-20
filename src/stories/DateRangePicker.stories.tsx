import type { Meta, StoryObj } from "@storybook/react-vite"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"
import { createZonedMidnightInstant } from "../utils/calender"

const meta: Meta<typeof DateRangePicker> = {
  title: "Components/DateRangePicker",
  component: DateRangePicker,
  parameters: {
    layout: "centered",
  },
}

export default meta

type Story = StoryObj<typeof DateRangePicker>

export const Default: Story = {
  args: {},
}

export const WithBlackout: Story = {
  args: {
    constraints: {
      blackoutDates: [
        Date.UTC(2026, 0, 10),
        Date.UTC(2026, 0, 15),
      ],
    },
  },
}

export const WithMinMax: Story = {
  args: {
    defaultTimeZone: "UTC",
    constraints: {
      min: createZonedMidnightInstant(2026, 0, 5, "UTC"),
      max: createZonedMidnightInstant(2026, 0, 25, "UTC"),
    },
  },
  render: (args) => {
    return (
      <DateRangePicker
        {...args}
        key="minmax"
      />
    )
  }
}

export const WithDurationLimit: Story = {
  args: {
    constraints: {
      minDurationMs: 2 * 24 * 60 * 60 * 1000,
      maxDurationMs: 7 * 24 * 60 * 60 * 1000,
    },
  },
}

export const WithMinViolation = {
  args: {
    defaultTimeZone: "UTC",
    constraints: {
      min: createZonedMidnightInstant(2026, 0, 10, "UTC"),
    },
  },
}

export const KeyboardOnly = {
  args: {},
  parameters: {
    docs: {
      description: {
        story:
          "Use arrow keys to navigate. Press Enter to select start and end. Escape resets selection.",
      },
    },
  },
}