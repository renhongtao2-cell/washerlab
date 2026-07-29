$taskName = "WasherLabDailyPublish"
$scriptPath = "C:\Users\Administrator\washerlab\scripts\daily-publish.ps1"

# Delete existing task if any
schtasks /DELETE /TN $taskName /F 2>$null

# Create scheduled task - daily at 8:00 AM
schtasks /CREATE /TN $taskName /SC DAILY /ST 08:00 `
  /TR "powershell.exe -NoProfile -ExecutionPolicy Bypass -File `"$scriptPath`"" `
  /RL HIGHEST /F

if ($?) {
  Write-Output "Scheduled task '$taskName' created: daily at 08:00"
  Write-Output "Script: $scriptPath"
} else {
  Write-Output "Failed to create scheduled task"
}
