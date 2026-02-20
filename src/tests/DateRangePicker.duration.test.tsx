import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"

describe("Duration constraints", () => {
  it("shows DURATION_VIOLATION when range is too short", async () => {
    render(
      <DateRangePicker
        defaultTimeZone="UTC"
        constraints={{
          minDurationMs: 3 * 24 * 60 * 60 * 1000, // 3 days
        }}
      />
    )

    const grid = screen.getByRole("grid")
    grid.focus()

    await userEvent.keyboard("{Enter}")

    await userEvent.keyboard("{ArrowRight}")
    await userEvent.keyboard("{Enter}")

    const error = await screen.findByText(/DURATION_VIOLATION/i)

    expect(error).toBeInTheDocument()
  })
})