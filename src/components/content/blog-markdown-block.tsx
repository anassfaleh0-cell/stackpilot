import { renderBlogInlineMarkdown } from "@/components/content/blog-inline-markdown"

export function BlogMarkdownBlock({ block, keyBase }: { block: string; keyBase: string }) {
  const lines = block.split("\n").filter(Boolean)
  const first = lines[0] ?? ""

  if (first.startsWith("### ")) {
    return <h3 className="text-lg font-semibold tracking-tight mt-8 mb-3">{renderBlogInlineMarkdown(first.slice(4), keyBase)}</h3>
  }
  if (first.startsWith("## ")) {
    return <h2 className="text-2xl font-bold tracking-tight mt-10 mb-4">{renderBlogInlineMarkdown(first.slice(3), keyBase)}</h2>
  }

  if (first.startsWith("|") && lines.length >= 2) {
    const cells = (line: string) => line.replace(/^\||\|$/g, "").split("|").map((cell) => cell.trim())
    const header = cells(first)
    const bodyRows = lines.filter((line) => !/^\|[\s:|-]+\|?$/.test(line)).slice(1)
    return (
      <div className="overflow-x-auto my-6">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="border-b border-border">
              {header.map((cell, index) => (
                <th key={index} className="text-left py-2 px-3 font-semibold text-foreground">
                  {renderBlogInlineMarkdown(cell, `${keyBase}-head-${index}`)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {bodyRows.map((row, rowIndex) => (
              <tr key={rowIndex} className="border-b border-border/50">
                {cells(row).map((cell, cellIndex) => (
                  <td key={cellIndex} className="py-2.5 px-3 text-muted-foreground">
                    {renderBlogInlineMarkdown(cell, `${keyBase}-r${rowIndex}c${cellIndex}`)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if (lines.length > 0 && lines.every((line) => /^[-*]\s+/.test(line))) {
    return (
      <ul className="list-disc pl-6 space-y-2 my-4">
        {lines.map((line, index) => (
          <li key={index}>{renderBlogInlineMarkdown(line.replace(/^[-*]\s+/, ""), `${keyBase}-li-${index}`)}</li>
        ))}
      </ul>
    )
  }

  if (lines.length > 0 && lines.every((line) => /^\d+\.\s+/.test(line))) {
    return (
      <ol className="list-decimal pl-6 space-y-2 my-4">
        {lines.map((line, index) => (
          <li key={index}>{renderBlogInlineMarkdown(line.replace(/^\d+\.\s+/, ""), `${keyBase}-li-${index}`)}</li>
        ))}
      </ol>
    )
  }

  return (
    <p>
      {lines.flatMap((line, index) => [
        <span key={`${keyBase}-line-${index}`}>{renderBlogInlineMarkdown(line, `${keyBase}-${index}`)}</span>,
        ...(index < lines.length - 1 ? [<br key={`${keyBase}-br-${index}`} />] : []),
      ])}
    </p>
  )
}
