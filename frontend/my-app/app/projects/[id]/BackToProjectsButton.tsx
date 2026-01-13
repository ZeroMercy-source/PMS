"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function BackToProjectsButton() {
  return (
    <Button asChild variant="secondary">
      <Link href="/">← Back to Projects</Link>
    </Button>
  )
}
