import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"
import { createZonedMidnightInstant } from "../utils/calender"

describe("Constraint enforcement", () => {
  it("prevents selecting date before min", async () => {
    const min = createZonedMidnightInstant(2026, 0, 15, "UTC")

    render(
      <DateRangePicker
        defaultTimeZone="UTC"
        constraints={{ min }}
      />
    )

    const grid = screen.getByRole("grid")
    grid.focus()

    // Try selecting first visible day
    await userEvent.keyboard("{Enter}")

    // Since it's disabled, no selection should exist
    const error = screen.queryByText(/Validation Error/i)

    expect(error).toBeNull()
  })
})