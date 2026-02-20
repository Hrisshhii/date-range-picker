import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect } from "vitest"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"

describe("Keyboard navigation", () => {
  it("allows arrow navigation and selection with keyboard", async () => {
    render(<DateRangePicker />)

    const grid = screen.getByRole("grid")

    // Focus grid
    grid.focus()

    // Move right
    await userEvent.keyboard("{ArrowRight}")
    await userEvent.keyboard("{ArrowRight}")

    // Select date
    await userEvent.keyboard("{Enter}")

    // Expect Start Time input to appear
    expect(screen.getByText("Start Time")).toBeInTheDocument()
  })
})