# 🧪 How to Test the Elasticsearch Agents

## 📍 Where Are the Agents?

The Elasticsearch agents are **embedded in 3 dashboards**:

### 1. Emergency Management Dashboard ⚡
**Location**: Admin Dashboard → Emergency Management
**URL**: `http://localhost:3000/admin` → Click "Emergency Management"

### 2. Laboratory Dashboard 🔬
**Location**: Admin Dashboard → Laboratory
**URL**: `http://localhost:3000/admin` → Click "Laboratory"

### 3. Doctor Dashboard 🩺
**Location**: Admin Dashboard → (Doctor role)
**URL**: Login as doctor role

---

## 🚀 Quick Test Guide (5 Minutes)

### Step 1: Start the Application
```bash
npm run dev
```

### Step 2: Login
- Go to `http://localhost:3000`
- Login with admin credentials
- You'll see the admin dashboard

### Step 3: Test Emergency Agent

1. **Navigate to Emergency Management**
   - Click "Emergency Management" in the sidebar
   - You should see the Emergency Dashboard with patient list

2. **Look for the Floating Button**
   - Bottom-right corner of the screen
   - Blue-purple gradient button with Bot icon
   - Should have a pulse animation

3. **Click the Floating Button**
   - Agent panel slides out from the right
   - Header says "Emergency Agent"
   - "Powered by Elasticsearch" badge visible

4. **Try a Suggestion**
   - You should see suggestion cards like:
     - "Analyze Patient Triage"
     - "Recommend Protocol"
     - "Optimize Resource Allocation"
   - Click "Analyze Patient Triage"
   - Agent should respond within 2 seconds

5. **Check Inline Suggestions**
   - Scroll through the patient list
   - Look for AI suggestion cards embedded in the triage board
   - These appear contextually based on patient data

### Step 4: Test Laboratory Agent

1. **Navigate to Laboratory**
   - Click "Laboratory" in the sidebar
   - You should see the Lab Dashboard

2. **Look for the Floating Button**
   - Same bottom-right corner
   - Click to open agent panel

3. **Try Lab-Specific Suggestions**
   - "Interpret Lab Results"
   - "Detect Abnormalities"
   - "Recommend Follow-up Tests"

### Step 5: Test Doctor Dashboard Agent

1. **Navigate to Doctor Dashboard**
   - May need to login as doctor role
   - Or access from admin dashboard

2. **Look for the Floating Button**
   - Click to open diagnostic agent

3. **Try Diagnostic Suggestions**
   - "Generate Differential Diagnosis"
   - "Search Medical Literature"
   - "Check Drug Interactions"

---

## 🎯 Detailed Testing Scenarios

### Scenario 1: Emergency Triage (CRITICAL TEST)

**Setup**:
1. Go to Emergency Management Dashboard
2. Find patient "Ahmed Hassan" (ER001)
3. Note his vitals: BP 180/95, HR 110, O2 92%

**Test Steps**:
1. Click floating agent button (bottom-right)
2. Agent panel opens showing "Emergency Agent"
3. Look for inline suggestion "Analyze Patient Triage"
4. Click the suggestion
5. **Expected Result**:
   - Agent responds within 2 seconds
   - Shows analysis of patient history
   - Identifies cardiac risk
   - Recommends "Cardiac Arrest Protocol"
   - Suggests room assignment
   - Provides action buttons

**What to Check**:
- ✅ Button appears and is clickable
- ✅ Panel slides out smoothly
- ✅ Suggestions are relevant to emergency context
- ✅ Response is fast (< 2 seconds)
- ✅ Content is relevant to the patient
- ✅ Action buttons appear

### Scenario 2: Lab Result Interpretation

**Setup**:
1. Go to Laboratory Dashboard
2. Find a pending test result (Glucose 180 mg/dL)

**Test Steps**:
1. Click floating agent button
2. Agent panel opens showing "Laboratory Agent"
3. Look for suggestion "Interpret Lab Results"
4. Click the suggestion
5. **Expected Result**:
   - Agent analyzes the glucose value
   - Compares to reference range (70-100 mg/dL)
   - Flags as "Abnormal"
   - Detects upward trend
   - Suggests follow-up tests (HbA1c, Lipid Panel)

**What to Check**:
- ✅ Agent understands lab context
- ✅ Suggestions are lab-specific
- ✅ Analysis is accurate
- ✅ Recommendations are relevant

### Scenario 3: Diagnostic Assistant

**Setup**:
1. Go to Doctor Dashboard
2. Select a patient with symptoms

**Test Steps**:
1. Click floating agent button
2. Type: "Generate differential diagnosis"
3. Press Enter
4. **Expected Result**:
   - Agent analyzes symptoms
   - Generates ranked diagnosis list
   - Provides evidence-based recommendations
   - Shows medical literature references

**What to Check**:
- ✅ Agent accepts text input
- ✅ Responds to diagnostic queries
- ✅ Provides structured output
- ✅ Includes references

---

## 🔍 Visual Checklist

### Floating Button
- [ ] Appears in bottom-right corner
- [ ] Has blue-purple gradient
- [ ] Shows Bot icon
- [ ] Has pulse animation
- [ ] Shows notification badge (if critical cases)
- [ ] Tooltip appears on hover
- [ ] Clicks smoothly

### Agent Panel
- [ ] Slides out from right side
- [ ] Has header with module name
- [ ] Shows "Powered by Elasticsearch" badge
- [ ] Has close button (X)
- [ ] Doesn't block important UI
- [ ] Scrollable content area
- [ ] Input field at bottom
- [ ] Send button works

### Suggestions
- [ ] Appear in agent panel
- [ ] Show priority colors (red/orange/yellow/blue)
- [ ] Have clear titles
- [ ] Have descriptions
- [ ] Clickable
- [ ] Execute actions when clicked

### Inline Suggestions (Emergency Dashboard)
- [ ] Appear in triage board
- [ ] Show AI icon/badge
- [ ] Contextual to patient
- [ ] Priority-based colors
- [ ] Clickable

---

## 🐛 Troubleshooting

### Agent Button Not Appearing

**Possible Causes**:
1. Not on the right dashboard
2. Component not imported
3. CSS issue

**Solution**:
```bash
# Check console for errors
# Open browser DevTools (F12)
# Look for errors in Console tab

# Verify you're on the right page
# Emergency: /admin → Emergency Management
# Lab: /admin → Laboratory
# Doctor: Doctor Dashboard
```

### Agent Panel Not Opening

**Possible Causes**:
1. JavaScript error
2. State management issue
3. Click handler not working

**Solution**:
```bash
# Check console for errors
# Try clicking multiple times
# Refresh the page
# Clear browser cache
```

### No Suggestions Appearing

**Possible Causes**:
1. Context not set correctly
2. Agent service not initialized
3. Elasticsearch not connected

**Solution**:
```bash
# Check .env file has Elasticsearch credentials
# Verify Elasticsearch is running
# Check console for API errors
```

### Agent Not Responding

**Possible Causes**:
1. Elasticsearch connection issue
2. API key invalid
3. Network error

**Solution**:
```bash
# Check .env file
VITE_ELASTICSEARCH_AGENT_ENDPOINT=your-endpoint
VITE_ELASTICSEARCH_API_KEY=your-key

# Test Elasticsearch connection
# Check browser Network tab for failed requests
```

---

## 🎥 Demo Mode Testing

If Elasticsearch is not connected, the agents work in **demo mode** with mock responses:

### Demo Mode Features:
- ✅ All UI components work
- ✅ Suggestions appear
- ✅ Mock responses (1 second delay)
- ✅ Action buttons work
- ✅ Conversation history maintained

### How to Test Demo Mode:
1. Don't configure Elasticsearch (leave .env empty)
2. Start the app: `npm run dev`
3. Navigate to dashboards
4. Click agent button
5. Try suggestions
6. You'll get mock responses

---

## 📊 What to Look For

### Good Signs ✅
- Floating button appears immediately
- Button has smooth animations
- Panel slides out smoothly
- Suggestions are contextual
- Responses are fast (< 2 seconds)
- Content is relevant
- No console errors
- UI is responsive

### Bad Signs ❌
- Button doesn't appear
- Panel doesn't open
- No suggestions
- Slow responses (> 5 seconds)
- Generic responses
- Console errors
- UI freezes
- Broken layout

---

## 🎬 Recording Demo Tips

### Before Recording:
1. Test all 3 dashboards
2. Verify all features work
3. Clear browser cache
4. Close unnecessary tabs
5. Disable notifications
6. Set zoom to 100%

### During Recording:
1. Start with Emergency (most impressive)
2. Show floating button clearly
3. Click and wait for panel
4. Click suggestion
5. Show response (< 2 seconds)
6. Highlight key features
7. Move to next dashboard

### What to Capture:
- Floating button appearance
- Button click and panel opening
- Suggestions appearing
- Click on suggestion
- Agent response
- Action buttons
- Inline suggestions (Emergency)

---

## 🚀 Quick Test Commands

```bash
# Start the app
npm run dev

# Open in browser
# http://localhost:3000

# Login as admin
# Navigate to Emergency Management
# Look for floating button (bottom-right)
# Click and test!
```

---

## 📝 Test Checklist

### Emergency Dashboard
- [ ] Navigate to Emergency Management
- [ ] Floating button appears
- [ ] Click button → panel opens
- [ ] See "Emergency Agent" header
- [ ] Suggestions appear
- [ ] Click "Analyze Patient Triage"
- [ ] Response within 2 seconds
- [ ] Inline suggestions in triage board
- [ ] Action buttons work

### Laboratory Dashboard
- [ ] Navigate to Laboratory
- [ ] Floating button appears
- [ ] Click button → panel opens
- [ ] See "Laboratory Agent" header
- [ ] Suggestions appear
- [ ] Click "Interpret Lab Results"
- [ ] Response within 2 seconds
- [ ] Lab-specific suggestions

### Doctor Dashboard
- [ ] Navigate to Doctor Dashboard
- [ ] Floating button appears
- [ ] Click button → panel opens
- [ ] See "Diagnostic Agent" header
- [ ] Suggestions appear
- [ ] Type query and send
- [ ] Response within 2 seconds
- [ ] Diagnostic-specific suggestions

---

## 🎯 Success Criteria

Your agents are working correctly if:

1. ✅ **Floating button appears** on all 3 dashboards
2. ✅ **Panel opens smoothly** when clicked
3. ✅ **Suggestions are contextual** (different per dashboard)
4. ✅ **Responses are fast** (< 2 seconds)
5. ✅ **Content is relevant** to the module
6. ✅ **No console errors**
7. ✅ **UI is responsive** and smooth
8. ✅ **Action buttons work**

---

## 🆘 Need Help?

### Check These Files:
1. **src/components/agent/AgentFloatingButton.tsx** - Floating button
2. **src/components/agent/AgentAssistantPanel.tsx** - Chat panel
3. **src/services/ElasticsearchAgentService.ts** - Agent logic
4. **src/hooks/useElasticsearchAgent.tsx** - React hook

### Common Issues:
- **Button not showing**: Check if component is imported in dashboard
- **Panel not opening**: Check console for errors
- **No suggestions**: Check context is set correctly
- **Slow responses**: Check Elasticsearch connection

---

## 🎊 You're Ready!

Follow this guide to test all agents. They should work perfectly!

**Start with Emergency Dashboard - it's the most impressive!** 🚀
