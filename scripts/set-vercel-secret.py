import subprocess,sys
r=subprocess.run(['security','find-generic-password','-a','vercel-actions','-s','VERCEL_TOKEN_KONGSI','-w'],capture_output=True,text=True)
v=r.stdout.strip()
try: v=bytes.fromhex(v).decode()
except Exception: pass
for repo in sys.argv[1:]:
    p=subprocess.run(['gh','secret','set','VERCEL_TOKEN','-R',f'kongsi-idea/{repo}'],input=v,capture_output=True,text=True)
    print(repo,'ok' if p.returncode==0 else 'FAIL '+p.stderr.strip()[:120])
