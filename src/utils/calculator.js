export const WordsNumberCalculator = (data) => {
  const wordsOfEassy = data
    .split(/[ .?!]+/)
    .map((item) => item.trim())
    .filter(Boolean)
  const sentenceOfEassy = data.split(/[.?!]/)
  const totalWordCount = wordsOfEassy.length
  let maxWordCount = 0
  for (let sentence of sentenceOfEassy) {
    const wordCount = sentence.split(/\s+/).length // 按空格分割计算词数
    if (wordCount > maxWordCount) {
      maxWordCount = wordCount // 更新最大词数
    }
  }
  console.log(totalWordCount, maxWordCount)
  return { totalWordCount, maxWordCount }
}
