import glob,urllib
print "Preparing source .js files..."
print "Appending: src/wamt.js"
r = open("src/wamt.js","r")
source = "\n".join(r.readlines())
minified = ""
r.close()
for file in glob.glob("src/*.js"):
    if file == "src\wamt.js" or file == "src/wamt.js":
        continue
    print "Appending: " + file
    r = open(file,"r")
    source = source + "\n" + ("\n".join(r.readlines()))
    r.close()
print "Prepared, posting to Google Closure Compiler (js minifier)"
r = urllib.urlopen("http://closure-compiler.appspot.com/compile",urllib.urlencode({"js_code": source,"compilation_level": "SIMPLE_OPTIMIZATIONS","output_format": "text","output_info": "compiled_code"}))
w = open("wamt-build.min.js","w")
w.write(r.read())
w.close()
print "Done, wamt-build.min.js"
