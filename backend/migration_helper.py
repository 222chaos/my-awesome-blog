import subprocess
import sys

if __name__ == "__main__":
    result = subprocess.run(
        [sys.executable, "-m", "alembic", "upgrade", "head"],
        capture_output=True,
        text=True,
    )
    
    if result.returncode == 0:
        print("✓ Migration executed successfully!")
        print(result.stdout)
    else:
        print("✗ Migration failed!")
        print(result.stderr)
        sys.exit(result.returncode)
