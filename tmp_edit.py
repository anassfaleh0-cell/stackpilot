import json

with open(r'C:\Users\user\Desktop\DEEPSK\content\reviews\chatgpt.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

for item in data['content']:
    if item.get('title') == 'Competitors':
        body = item['body']
        # Trim Gemini and Copilot entries
        body = body.replace(
            'trails GPT-5 by 2-8 percentage points on academic benchmarks, less sophisticated code generation, and weaker image analysis. Best for Google-centric organizations and users needing massive context windows.',
            'trails GPT-5 on academic benchmarks and has weaker code generation. Best for Google-centric organizations and users needing massive context windows.'
        )
        body = body.replace(
            'less flexible standalone chat experience, limited Custom GPT ecosystem, and restricted web browsing. Best for Microsoft 365 enterprise customers.',
            'less flexible standalone chat and limited Custom GPT ecosystem. Best for Microsoft 365 enterprise customers.'
        )
        item['body'] = body
        break

with open(r'C:\Users\user\Desktop\DEEPSK\content\reviews\chatgpt.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print('Done')
