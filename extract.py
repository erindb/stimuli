from xml.dom import minidom
import sys

doc = minidom.parse(sys.argv[1])
layers = [layer for layer in doc.getElementsByTagName('g')]
for layer in layers:
    layer_id = layer.getAttribute('inkscape:label')
    print "\"" + layer_id + "\": {",
    for path in layer.getElementsByTagName('path'):
        piece = path.getAttribute('id').split("-")[0]
        pathstring = path.getAttribute('d')
        print "\"" + piece + "\":" + '"' + pathstring + '", \n',
    print "},"
doc.unlink()

# def multiline(string, indent):
#   cperline = 80 - indent - 4
#   n_lines = len(string) / cperline + 1
#   ret_string = '"' + string[0:cperline]
#   for i in range(n_lines)[1:]:
#     ret_string += '" + \n'+' '*indent+'"'
#     ret_string +=string[i*cperline:(i+1)*cperline]
#   return ret_string + '"'

# identical = ['hair', 'bangs', #'bigreflect1', 'bigreflect2', 'smallreflect1',
#              #'smallreflect2', 'pupil1', 'pupil2',
#              'face', 'neck']

# doc = minidom.parse("alice.svg")  # parseString also exists
# layers = [ layer for layer in doc.getElementsByTagName('g')]
# for layer in doc.getElementsByTagName('g'):
#   layer_id = layer.getAttribute('inkscape:label')
#   layer_indent = len(layer_id) + 9
#   pieces = [ (path.getAttribute('d'), path.getAttribute('id') ) for path
#              in layer.getElementsByTagName('path')]
#   print "var", layer_id, '= {',
#   for i in range(len(pieces)):
#     piece = pieces[i]
#     p_id = piece[1].split("-")[0]
#     indent = len(p_id) + 4 + layer_indent
#     if (i == 0):
#       ind = ''
#     else:
#       ind = ' '*layer_indent
#     if (i == len(pieces) - 1):
#       print ind + '"' + p_id + '":',
#       if (p_id in identical):
#         print p_id,
#       else:
#         print multiline(piece[0], indent),
#       print '};'
#     else:
#       print ind + '"' + p_id + '":',
#       if (p_id in identical):
#         print p_id + ','
#       else:
#         print multiline(piece[0], indent) + ','
#   print
# doc.unlink()
