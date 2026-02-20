import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"
import { createZonedMidnightInstant } from "../utils/calender"

describe("Blackout constraints", () => {
  it("prevents selecting blackout date", async () => {
    const blackout = createZonedMidnightInstant(2026, 0, 10, "UTC")

    render(
      <DateRangePicker
        defaultTimeZone="UTC"
        constraints={{
          blackoutDates: [blackout],
        }}
      />
    )

    const grid = screen.getByRole("grid")
    grid.focus()

    for (let i = 0; i < 9; i++) {
      await userEvent.keyboard("{ArrowRight}")
    }

    await userEvent.keyboard("{Enter}")

    const error = screen.queryByText(/BLACKOUT_VIOLATION/i)

    expect(error).toBeNull()
  })
})