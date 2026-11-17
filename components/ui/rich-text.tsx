import { parseRichText } from '@/lib/rich-text'
import tw from '@/lib/tailwind'
import { useMemo } from 'react'
import { Text, View } from 'react-native'

interface RichTextProps {
  /** The HTML saved from the rich editor (see parseRichText for what is understood). */
  html: string
  color: string
  size?: number
}

/** Shows rich text (bold, italic, headings, bullets) as normal Text, without rendering any HTML. */
export function RichText({ html, color, size = 14 }: RichTextProps) {
  const blocks = useMemo(() => parseRichText(html), [html])

  return (
    <View>
      {blocks.map((block, index) => {
        const text = (
          <Text
            style={[
              block.type === 'heading' ? tw`font-nunito-bold` : tw`font-nunito`,
              { color, fontSize: block.type === 'heading' ? size + 2 : size, lineHeight: size * 1.5 },
            ]}
          >
            {block.runs.map((run, runIndex) => (
              <Text
                key={runIndex}
                style={[
                  run.bold ? tw`font-nunito-bold` : undefined,
                  run.italic ? { fontStyle: 'italic' } : undefined,
                ]}
              >
                {run.text}
              </Text>
            ))}
          </Text>
        )

        return (
          <View key={index} style={[tw`flex-row`, index > 0 ? tw`mt-[10px]` : undefined]}>
            {block.type === 'bullet' && (
              <Text style={[tw`font-nunito mr-[8px]`, { color, fontSize: size, lineHeight: size * 1.5 }]}>•</Text>
            )}
            <View style={tw`flex-1`}>{text}</View>
          </View>
        )
      })}
    </View>
  )
}
