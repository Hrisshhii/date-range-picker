import { render } from "@testing-library/react"
import { describe, it, expect } from "vitest"
import { axe } from "vitest-axe"
import DateRangePicker from "../components/DateRangePicker/DateRangePicker"

describe("Accessibility", () => {
  it("has no accessibility violations", async () => {
    const { container } = render(<DateRangePicker />)
    const results = await axe(container)

    expect(results.violations).toHaveLength(0)
  })
})